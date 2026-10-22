import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { checkAndUpdateLimit } from "@/lib/checkLimits";
import { adminDb } from "@/lib/firebaseAdmin";

// 🔒 Security Fix: Server-side environment key එක Vercel AI SDK එකට ලබා දීම
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing in .env.local");
      return NextResponse.json({ error: "API Key එක ඇතුළත් කර නැත." }, { status: 500 });
    }

    const body = await req.json();
    const { image, userEmail, isPro } = body;

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

    const cleanEmail = userEmail.trim().toLowerCase();

    // 🎯 1. Live Firestore Database එකෙන් User ගේ PRO status සෘජුව පරීක්ෂා කිරීම
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    const isProUser =
      isPro === true ||
      userData?.isPaid === true ||
      userData?.plan === "pro";

    // 🛑 2. Photo Scan Limit Check එක සිදු කරන්නේ FREE පරිශීලකයින්ට පමණි (PRO අයට Unlimited)
    if (!isProUser) {
      const limitCheck = await checkAndUpdateLimit(cleanEmail, "photoScan");
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { error: limitCheck.message },
          { status: 429 } // Limit එක පැන්න විට status 429 යවයි
        );
      }
    }

    // 🎯 3. ඔයාගේ ප්‍රොම්ප්ට් එක සහ නීති රීති (100% වෙනස් නොකර තබා ඇත)
    const promptText = `
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
      8. For square roots, ALWAYS use the radical symbol '√' (Unicode) immediately followed by the number or expression in parentheses. Example: AC = √100. NEVER write Sinhalese words like 'වර්ගමූලය' or English words like 'sqrt'.
      
      OUTPUT RULES:
      1. Provide clear, simple, step-by-step mathematical solutions in Sinhala language based ONLY on the problem in the image.
      2. If a diagram is needed to explain the solution better, generate valid HTML <svg> code at the end of your response inside [[SVG: <svg>...</svg>]] tag.
    `;

    // 🎯 4. Vercel AI SDK හරහා gemini-1.5-flash භාවිතයෙන් Image Stream කිරීම
    const result = streamText({
      model: google('gemini-3.6-flash'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            { type: 'image', image: image },
          ],
        },
      ],
      async onFinish({ text }) {
        // 🎯 5. Firestore Database එකට Scan History එක Save කිරීම (Admin SDK භාවිතයෙන්)
        try {
          const svgMatch = text.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/) || text.match(/(<svg[\s\S]*?<\/svg>)/);
          const svgDiagram = svgMatch ? svgMatch[1] : "";
          const cleanContent = text
            .replace(/\[\[SVG:[\s\S]*?\]\]/g, "")
            .replace(/(<svg[\s\S]*?<\/svg>)/g, "")
            .trim();

          await adminDb.collection("user_chats").add({
            userEmail: cleanEmail,
            role: "user",
            content: "📸 [Photo Scan ප්‍රශ්නයක් යොමු කරන ලදී]",
            createdAt: new Date(),
          });

          await adminDb.collection("user_chats").add({
            userEmail: cleanEmail,
            role: "assistant",
            content: cleanContent || text,
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
    console.error("Gemini Scanner Error:", error?.message || error);
    return NextResponse.json({ error: "විසඳුම ලබා ගැනීමට නොහැකි විය: " + (error?.message || "Internal Error") }, { status: 500 });
  }
}