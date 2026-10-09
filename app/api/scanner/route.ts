import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkAndUpdateLimit } from "@/lib/checkLimits";
import { adminDb } from "@/lib/firebaseAdmin";

// 🔒 Security Fix: Server-side environment key එක භාවිත කිරීම
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // API Key එක නැත්නම් Error එකක් දෙනවා
    if (!apiKey) {
      console.error("API Key is missing in .env.local");
      return NextResponse.json({ error: "API Key එක ඇතුළත් කර නැත." }, { status: 500 });
    }

    const { image, userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: "User Email එක හමු නොවීය. කරුණාකර පළමුව Log වන්න." },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "ඡායාරූපයක් ලබා දී නැත." },
        { status: 400 }
      );
    }

    // 🛑 1. Photo Scan Daily Limit Check එක සිදු කිරීම (Free: 1, Paid: 20)
    const limitCheck = await checkAndUpdateLimit(userEmail, "photoScan");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.message },
        { status: 429 } // Limit එක පැන්න විට status 429 යවයි
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const imageData = image.split(",")[1];

    // 2. ප්‍රොම්ප්ට් එක
    const prompt = `
      You are a strict O/L Mathematics tutor. Analyze the math problem shown in this image.
      Follow these rules exactly:
      
      FORMATTING RULES (MUST FOLLOW):
      1. NEVER use LaTeX, '$', '\\frac', or any math formatting symbols.
      2. USE ONLY PLAIN TEXT.
      3. For fractions, write as 'a/b' (e.g., 26/25).
      4. For multiplication use '*' or 'x', for powers use '^2'.
      5. NO conversational filler, no introductions, no 'baila'.
      6. For angles, ALWAYS use the degree symbol '°' immediately after the number (e.g., 70°, y°). NEVER write the word 'degrees' and NEVER use the caret symbol '^' for degrees.
      7. For naming angles with three letters, ALWAYS place a circumflex hat over the middle letter in plain text, like A B̂ C or P Q̂ R. NEVER use LaTeX like \\hat{} or \\angle.
      8. For square roots, ALWAYS use the radical symbol '√' (Unicode) immediately followed by the number or expression in parentheses. Example: AC = √100. NEVER write Sinhalese words like 'වර්ගමූලය' or English words like 'sqrt
      
      OUTPUT RULES:
      1. Provide clear, simple, step-by-step mathematical solutions in Sinhala language based ONLY on the problem in the image.
      2. If a diagram is needed to explain the solution better, generate valid HTML <svg> code at the end of your response.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);

    const response = result.response; 
    const text = response.text();

    // 🎯 3. Firestore Database එකට Scan History එක Save කිරීම (Admin SDK භාවිතයෙන්)
    try {
      const svgMatch = text.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/) || text.match(/(<svg[\s\S]*?<\/svg>)/);
      const svgDiagram = svgMatch ? svgMatch[1] : "";
      const cleanContent = text.replace(/\[\[SVG:[\s\S]*?\]\]/g, "").replace(/(<svg[\s\S]*?<\/svg>)/g, "").trim();

      await adminDb.collection("user_chats").add({
        userEmail,
        role: "user",
        content: "📸 [Photo Scan ප්‍රශ්නයක් යොමු කරන ලදී]",
        createdAt: new Date(),
      });

      await adminDb.collection("user_chats").add({
        userEmail,
        role: "assistant",
        content: cleanContent || text,
        svgDiagram,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("DB Save Error:", dbErr);
    }

    // 4. Frontend එකට Response එක යැවීම
    return NextResponse.json({ text, success: true });

  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return NextResponse.json({ error: "විසඳුම ලබා ගැනීමට නොහැකි විය: " + error.message }, { status: 500 });
  }
}