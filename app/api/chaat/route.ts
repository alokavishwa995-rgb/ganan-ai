import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { checkAndUpdateLimit } from "@/lib/checkLimits";

// 🔒 Security Fix: Server-side key එක භාවිත කිරීම
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// ----------------------------------------------------
// GET: Chat History Load කිරීම
// ----------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ success: false, messages: [] });
    }

    // Admin SDK භාවිතයෙන් Database එකෙන් History එක ලබා ගැනීම
    const snapshot = await adminDb
      .collection("user_chats")
      .where("userEmail", "==", userEmail)
      .orderBy("createdAt", "asc")
      .limit(40)
      .get();

    const messages = snapshot.docs.map((doc) => ({
      role: doc.data().role,
      content: doc.data().content,
      svgDiagram: doc.data().svgDiagram || "",
    }));

    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error("Fetch History Error:", err);
    return NextResponse.json({ success: false, messages: [] });
  }
}

// ----------------------------------------------------
// POST: New Chat Message & Limit Check
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    const body = await req.json();
    const messages = body.messages || [];
    const userEmail = body.userEmail;
    const userMessage = messages[messages.length - 1]?.content || "";

    // A. Email එක තියෙනවද කියලා බලනවා
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "කරුණාකර පළමුව Email එකෙන් Log වන්න." }, { status: 401 });
    }

    if (!userMessage.trim()) {
      return NextResponse.json({ success: false, error: "ප්‍රශ්නයක් ඇතුළත් කර නැත." }, { status: 400 });
    }

    // B. AI එකට Request එක යවන්න කලින් Limit Check එක සිදු කිරීම
    const limitCheck = await checkAndUpdateLimit(userEmail, "askQuestions");
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: limitCheck.message },
        { status: 429 }
      );
    }

    // C. Limit එක ඇතුළේ ඉන්නවා නම් Gemini AI එකට Request එක යැවීම
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: { temperature: 0.3 },
    });

    const systemPrompt = `
      ඔබ ශ්‍රී ලංකා අ.පො.ස. සාමාන්‍ය පෙළ (O/L) ගණිත ගුරුවරයා වන 'ගණිත මිතුරා' ය.

      ප්‍රධාන නීති:
      1. ළමයා අසන ප්‍රශ්නයට පමණක් සෘජුව, කෙටියෙන් සහ පියවරෙන් පියවර පිළිතුරු දෙන්න.
      2. කිසිම විටෙක මුළු අභ්‍යාස පිටු හෝ දීර්ඝ පෙළපොත් කොටස් එකවර Chat එකට කොපි කර එවන්න එපා!
      3. ළමයා "ගණන් කියල දෙන්න" වැනි පොදු දෙයක් ඇහුවොත්, "ඔයාට අද කුමන පාඩමෙන්ද ගණන් හදන්න ඕන?" කියා අසා, එක සුළු උදාහරණ ගණනක් පමණක් ඉදිරිපත් කරන්න.
      4. ගණිතමය සූත්‍ර ලියන විට KaTeX/LaTeX ආකෘතිය ($...$ හෝ $$...$$) භාවිත කරන්න.
      5. 100% මිත්‍රශීලී සිංහල භාෂාවෙන් පමණක් පිළිතුරු දෙන්න.
      6. ජ්‍යාමිතිය හෝ රූපසටහනක් අවශ්‍යම නම් පමණක් පිරිසිදු SVG කේතය [[SVG: <svg>...</svg>]] ලෙස අගට එක් කරන්න.
    `;

    const formattedHistory = messages
      .slice(-6)
      .map((m: any) => `${m.role === "user" ? "Student" : "Teacher"}: ${m.content}`)
      .join("\n");

    const promptText = `පරණ සංවාදය:\n${formattedHistory}\n\nළමයාගේ නව ප්‍රශ්නය: ${userMessage}`;

    const resultStream = await model.generateContentStream([
      { text: systemPrompt },
      { text: promptText },
    ]);

    const encoder = new TextEncoder();
    let fullAiResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of resultStream.stream) {
          const text = chunk.text();
          fullAiResponse += text;
          controller.enqueue(encoder.encode(text));
        }

        // DB එකට Save කිරීම (Admin SDK භාවිතයෙන්)
        try {
          const svgMatch = fullAiResponse.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/);
          const svgDiagram = svgMatch ? svgMatch[1] : "";
          const cleanContent = fullAiResponse.replace(/\[\[SVG:[\s\S]*?\]\]/g, "").trim();

          await adminDb.collection("user_chats").add({
            userEmail,
            role: "user",
            content: userMessage,
            createdAt: new Date(),
          });

          await adminDb.collection("user_chats").add({
            userEmail,
            role: "assistant",
            content: cleanContent,
            svgDiagram,
            createdAt: new Date(),
          });
        } catch (e) {
          console.warn("DB Save Error:", e);
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ success: false, error: "දෝෂයක් ඇති විය." }, { status: 500 });
  }
}