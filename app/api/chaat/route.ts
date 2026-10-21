import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { checkAndUpdateLimit } from '@/lib/checkLimits';

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

    const cleanEmail = userEmail.trim().toLowerCase();

    const snapshot = await adminDb
      .collection("user_chats")
      .where("userEmail", "==", cleanEmail)
      .orderBy("createdAt", "asc")
      .limit(40)
      .get();

    const messages = snapshot.docs.map((doc: any) => ({
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
// POST: Vercel AI SDK Chat Stream & Firestore Log
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    const { messages, userEmail, isPro } = await req.json();

    if (!userEmail) {
      return new Response("කරුණාකර පළමුව Email එකෙන් Log වන්න.", { status: 401 });
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const userMessage = messages[messages.length - 1]?.content || "";

    if (!userMessage.trim()) {
      return new Response("ප්‍රශ්නයක් ඇතුළත් කර නැත.", { status: 400 });
    }

    // 1. Live Firestore Database එකෙන් User PRO ද යන්න පරීක්ෂා කිරීම
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    const isProUser =
      isPro === true ||
      userData?.isPaid === true ||
      userData?.plan === "pro";

    // 2. FREE පරිශීලකයින් සඳහා පමණක් Limit Check එක සිදු කිරීම (PRO අයට Unlimited)
    if (!isProUser) {
      const limitCheck = await checkAndUpdateLimit(cleanEmail, "askQuestions");

      if (!limitCheck.allowed) {
        return new Response(limitCheck.message, { status: 429 });
      }
    }

    // 3. Vercel AI SDK හරහා Gemini Model එකෙන් Response Stream කිරීම
    const result = streamText({
      model: google('gemini-3.8-flash'),
      system: `ඔබ ශ්‍රී ලංකා අ.පො.ස. සාමාන්‍ය පෙළ (O/L) ගණිත ගුරුවරයා වන 'ගණිත මිතුරා' ය.

      ප්‍රධාන නීති:
      1. ළමයා අසන ප්‍රශ්නයට පමණක් සෘජුව, කෙටියෙන් සහ පියවරෙන් පියවර පිළිතුරු දෙන්න.
      2. කිසිම විටෙක මුළු අභ්‍යාස පිටු හෝ දීර්ඝ පෙළපොත් කොටස් එකවර Chat එකට කොපි කර එවන්න එපා!
      3. ළමයා "ගණන් කියල දෙන්න" වැනි පොදු දෙයක් ඇහුවොත්, "ඔයාට අද කුමන පාඩමෙන්ද ගණන් හදන්න ඕන?" කියා අසා, එක සුළු උදාහරණ ගණනක් පමණක් ඉදිරිපත් කරන්න.
      4. ගණිතමය සූත්‍ර ලියන විට KaTeX/LaTeX ආකෘතිය ($...$ හෝ $$...$$) භාවිත කරන්න.
      5. 100% මිත්‍රශීලී සිංහල භාෂාවෙන් පමණක් පිළිතුරු දෙන්න.
      6. ජ්‍යාමිතිය හෝ රූපසටහනක් අවශ්‍යම නම් පමණක් පිරිසිදු SVG කේතය [[SVG: <svg>...</svg>]] ලෙස අගට එක් කරන්න.`,
      messages,
      async onFinish({ text }) {
        // AI එකෙන් පිළිතුර සම්පූර්ණ වූ පසු Firestore එකට Save කිරීම
        try {
          const svgMatch = text.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/);
          const svgDiagram = svgMatch ? svgMatch[1] : "";
          const cleanContent = text.replace(/\[\[SVG:[\s\S]*?\]\]/g, "").trim();

          await adminDb.collection("user_chats").add({
            userEmail: cleanEmail,
            role: "user",
            content: userMessage,
            createdAt: new Date(),
          });

          await adminDb.collection("user_chats").add({
            userEmail: cleanEmail,
            role: "assistant",
            content: cleanContent,
            svgDiagram,
            createdAt: new Date(),
          });
        } catch (dbErr) {
          console.warn("DB Save Error:", dbErr);
        }
      },
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("Vercel AI Chat Error:", error);
    return new Response("දෝෂයක් ඇති විය.", { status: 500 });
  }
}