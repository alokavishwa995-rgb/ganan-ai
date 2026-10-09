import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkAndUpdateLimit } from "@/lib/checkLimits";

// ⏱️ Vercel / Hosting Timeout වීම වැළැක්වීමට Max Duration එක තත්පර 60ක් ලෙස සැකසීම
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// 🔒 Server-side environment key එක පමණක් භාවිත කිරීම
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

function sanitizeMathData(obj: any): any {
  if (typeof obj === "string") {
    return obj
      .replace(/Ifrac|ifrac|Vfrac|Mrac|Mfrac/g, "\\frac")
      .replace(/\$([^$]+)\$/g, (_, mathContent) => {
        // KaTeX Warning එන Sinhala ZWJ Unicode Character (\u200D) ඉවත් කරයි
        return `$${mathContent.replace(/\u200D/g, "")}$`;
      });
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeMathData);
  }
  if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};
    for (const key in obj) {
      cleaned[key] = sanitizeMathData(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

// 🔄 Google 503 / 429 Errors සඳහා Exponential Delay සහිත Auto-Retry Function එක
async function generateWithRetry(model: any, prompt: string, maxRetries = 5, initialDelayMs = 4000) {
  let delay = initialDelayMs;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      const status = error?.status || error?.statusCode;
      const isBusy = status === 503 || status === 429 || error?.message?.includes("503") || error?.message?.includes("429");

      if (isBusy && attempt < maxRetries) {
        console.warn(`Gemini API Busy (${status || "Overloaded"}). Retrying attempt ${attempt}/${maxRetries} in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // 4s -> 8s -> 16s -> 32s ලෙස Google Server එක නිදහස් වන තෙක් බලා සිටී
      } else {
        throw error;
      }
    }
  }
  throw new Error("Gemini API Retry Limit Exceeded");
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("GEMINI_API_KEY එක .env හි සෙට් කර නැත.");
      return NextResponse.json(
        { success: false, error: "API Key එක සකසා නැත. Server configuration පරීක්ෂා කරන්න." },
        { status: 500 }
      );
    }

    // 1. Request එකෙන් userEmail එක ලබා ගැනීම
    const body = await req.json().catch(() => ({}));
    const userEmail = body.userEmail;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "User Email එක හමු නොවීය. කරුණාකර පළමුව Log වන්න." },
        { status: 400 }
      );
    }

    // 🛑 2. Paper Generator Limit Check එක සිදු කිරීම
    const limitCheck = await checkAndUpdateLimit(userEmail, "paperGen");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: limitCheck.message },
        { status: 429 }
      );
    }

    // 🎯 Model Configuration (gemini-3.8-flash, temperature: 0.3)
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            paper2PartA: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.NUMBER },
                  topic: { type: SchemaType.STRING },
                  mainContext: { type: SchemaType.STRING },
                  svgDiagram: { type: SchemaType.STRING },
                  totalMarks: { type: SchemaType.NUMBER },
                  subQuestions: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        subId: { type: SchemaType.STRING },
                        questionText: { type: SchemaType.STRING },
                        correctAnswer: { type: SchemaType.STRING },
                        solutionSteps: {
                          type: SchemaType.ARRAY,
                          items: { type: SchemaType.STRING },
                        },
                        marks: { type: SchemaType.NUMBER },
                      },
                      required: [
                        "subId",
                        "questionText",
                        "correctAnswer",
                        "solutionSteps",
                        "marks",
                      ],
                    },
                  },
                },
                required: [
                  "id",
                  "topic",
                  "mainContext",
                  "totalMarks",
                  "subQuestions",
                ],
              },
            },
          },
          required: ["paper2PartA"],
        },
      },
    });

    const prompt = `
You are an expert exam paper creator for Sri Lankan G.C.E. O/L Mathematics (Grade 10 and 11 syllabi).
Generate exactly 6 long-structured questions for O/L Mathematics Paper 2 (Part A) following the exact Sri Lankan National Exam syllabus structure. Each question carries 10 marks (Total 60 marks, students answer 5).

STRICT QUESTION TOPIC BLUEPRINT (Questions 1 to 6):
- Q1: Compound Interest / Reducing Balance Method / Stock Market Investments (පොලිය හා කොටස් වෙළෙඳපොළ) - Real life financial problems, simple vs compound interest, or reducing balance installment calculations. -> SVG: ""
- Q2: Quadratic Graphs (වර්ගජ ශ්‍රිත ප්‍රස්තාර) - Given $y = a x^2 + bx + c$, complete table, describe graph characteristics (turning point, axis of symmetry), find roots/intervals where $y > 0$ or line intersections. -> MUST INCLUDE SVG DIAGRAM (A clean Cartesian Coordinate Grid).
- Q3: Trigonometry Applications (ත්‍රිකෝණමිතිය) - Real-world height/distance problem involving angles of elevation/depression ($\sin, \cos, \tan$) with non-right angle triangles or vertical structures. -> MUST INCLUDE SVG DIAGRAM (A clean 2D geometric/trigonometric diagram with labeled points like A, B, C, D, E and angle arcs).
- Q4: Applied Quadratic Equations (වර්ගජ සමීකරණ යෙදීම්) - Word problem based on area of shapes (e.g., cake, garden, land) leading to $ax^2 + bx + c = 0$, solving using formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ or square completion, finding physical dimensions. -> MUST INCLUDE SVG DIAGRAM (Geometric shape layout with dimensions labeled in terms of $x$).
- Q5: Simultaneous Equations & Word Problems (යුගපත් සමීකරණ) - Formulating two linear simultaneous equations from real-life scenarios (purchases, totals) and finding unknown quantities, followed by a secondary condition/inequality. -> SVG: ""
- Q6: Grouped Statistics & Mean (සංඛ්‍යානය - මධ්‍යන්‍යය) - Grouped frequency distribution table, calculating mean using Assumed Mean method (උපකල්පිත මධ්‍යන්‍යය), predicting future profits/earnings based on the calculated mean. -> SVG: ""

CRITICAL FORMATTING & RULES:
1. Question Text, Sub-questions, Answers, and Solution steps MUST be written in high-quality, natural Sinhala (සිංහල).
2. Structure questions clearly using subQuestions with subId: "i", "ii", "iii", "iv" or "a", "b".
3. For all math symbols, powers, square roots, and fractions, ALWAYS use inline LaTeX enclosed in single dollar signs like $y = -x^2 + 2x + 3$, $\\sqrt{34}$, $26^\\circ 10'$.
4. SVG DIAGRAM RULES:
   - For Q2, Q3, and Q4, generate clean, valid, responsive SVG strings inside "svgDiagram".
   - Use standard SVG tags: <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">...</svg>
   - Ensure lines are clear (stroke="#1e293b", stroke-width="2"), background is clean, and text labels ($x, y$, angle values, letter points) are properly placed and readable.
`;

    const result: any = await generateWithRetry(model, prompt, 5, 4000);
    const rawText = result.response.text();

    let paperData;
    try {
      paperData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON Parse Error:", rawText);
      return NextResponse.json(
        { success: false, error: "Paper 2 (A කොටස) සෑදීමේදී JSON Format දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න." },
        { status: 500 }
      );
    }

    const cleanedData = sanitizeMathData(paperData);

    return NextResponse.json({ success: true, paper2PartA: cleanedData.paper2PartA });
  } catch (error: any) {
    console.error("Paper 2 Part A API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Paper 2 (A කොටස) සෑදීමේදී දෝෂයක් සිදු විය." },
      { status: error?.status || 500 }
    );
  }
}