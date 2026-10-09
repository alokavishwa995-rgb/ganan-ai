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
    return obj.replace(/Ifrac|ifrac|Vfrac|Mrac|Mfrac/g, "\\frac");
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

// 🔄 Google 503 / 429 Errors සඳහා Auto-Retry කරන Function එක
async function generateWithRetry(model: any, prompt: string, maxRetries = 3, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      const status = error?.status || error?.statusCode;
      const isBusy = status === 503 || status === 429 || error?.message?.includes("503") || error?.message?.includes("429");

      if (isBusy && attempt < maxRetries) {
        console.warn(`Gemini API Busy (${status || "Overloaded"}). Retrying attempt ${attempt}/${maxRetries} in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 1.5; // එක දිගට නොවී ඊළඟ Delay එක තව ටිකක් වැඩි කරයි
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

    // 🎯 Structured JSON Output සදහා responseSchema එක් කිරීම
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            partB: {
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
          required: ["partB"],
        },
      },
    });

    const prompt = `
You are an expert exam paper creator for Sri Lankan G.C.E. O/L Mathematics (Grade 10 and 11 syllabi).
Generate exactly 5 structured questions for O/L Mathematics Paper 1 (Part B) following the exact Sri Lankan National Exam syllabus structure. Each question carries 10 marks (Total 50 marks).

STRICT QUESTION TOPIC BLUEPRINT (Questions 1 to 5):
- Q1: Fractions (භාග) - Real-life problem involving remaining fractions, multi-step sub-questions (i, ii, iii), finding original quantity. -> SVG: ""
- Q2: Kinematics Graphs (දුර-කාල / වේග-කාල ප්‍රස්තාර) - Interpreting a distance-time or speed-time graph, calculating speed/acceleration, drawing modified lines. -> MUST INCLUDE SVG DIAGRAM (A clean graph with axes, time in minutes/seconds, distance/speed labeled).
- Q3: Percentages & Taxes (ප්‍රතිශත හා බදු) - Rates, Rates tax (වරිපනම් බදු), Customs duty (තීරු බදු), or Income tax with multi-stage calculations. -> SVG: ""
- Q4: Probability (සම්භාවිතාව) - Two-stage experiment with (i) Sample space Grid (කොටු දැල) and (ii) Tree Diagram (රුක් සටහන) for dependent/independent events. -> MUST INCLUDE SVG DIAGRAM (A clean grid with X/V/C labels OR a tree diagram with branch probabilities).
- Q5: Perimeter/Area of Sectors OR Statistics (කේන්ද්‍රික ඛණ්ඩ / සංඛ්‍යානය) - Calculating sector perimeter/angle, or completing a frequency distribution/ogive table. -> MUST INCLUDE SVG DIAGRAM (A clean sector/semicircle diagram or frequency chart).

CRITICAL FORMATTING & RULES:
1. Question Text, Sub-questions, Answers, and Solution steps MUST be written in high-quality, natural Sinhala (සිංහල).
2. Use standard sub-question format for subId: "i", "ii", "iii", "iv" or "a", "b", "c".
3. For all math equations, fractions, and values, use inline LaTeX enclosed in single dollar signs like $\\frac{2}{5}$, $30\\%$, $12\\text{ m/s}$.
4. SVG DIAGRAM RULES:
   - For Q2, Q4, and Q5, generate valid, responsive, crisp SVG strings inside "svgDiagram".
   - Use standard SVG tags: <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">...</svg>
   - Graph lines, tree branches, grids, and sector boundaries must have clear styling (stroke="#1e293b", stroke-width="2", fill="none").
   - Include clean text labels (numbers, axis names, tree branch probabilities like $\\frac{2}{3}$) inside the SVG.
`;

    // Direct call එක වෙනුවට generateWithRetry භාවිත කර ඇත
    const result: any = await generateWithRetry(model, prompt, 3, 3000);
    const rawText = result.response.text();

    let paperData;
    try {
      paperData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON Parse Error:", rawText);
      return NextResponse.json(
        { success: false, error: "B කොටස සෑදීමේදී JSON Format දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න." },
        { status: 500 }
      );
    }

    const cleanedData = sanitizeMathData(paperData);

    return NextResponse.json({ success: true, partB: cleanedData.partB });
  } catch (error: any) {
    console.error("Part B API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "B කොටස සෑදීමේදී දෝෂයක් සිදු විය." },
      { status: error?.status || 500 }
    );
  }
}