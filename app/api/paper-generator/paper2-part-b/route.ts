import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkAndUpdateLimit } from "@/lib/checkLimits";

// ⏱️ Paper 2 B කොටස සාදද්දී Vercel / Hosting Timeout වීම වැළැක්වීමට Max Duration එක තත්පර 60ක් ලෙස සැකසීම
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// 🔒 Security Fix: Server-side environment key එක පමණක් භාවිත කිරීම
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

    // 🎯 Paper 2 B කොටස (Paper 2 Part B) සඳහා Structured output Schema එක (gemini-3.8-flash, temperature: 0.3)
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            paper2PartB: {
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
          required: ["paper2PartB"],
        },
      },
    });

    const prompt = `
You are an expert exam paper creator for Sri Lankan G.C.E. O/L Mathematics (Grade 10 and 11 syllabi).
Generate exactly 6 long-structured questions for O/L Mathematics Paper 2 (Part B) following the exact Sri Lankan National Exam syllabus structure (Questions 7 to 12). Students choose 5 out of 6 questions (10 marks each, Total 50 marks).

STRICT QUESTION TOPIC BLUEPRINT (Questions 7 to 12):
- Q7: Progressions / Arithmetic & Geometric Sequences (ශ්‍රේඪි - AP & GP) - Real-life contextual problems involving terms ($T_n$), sum of terms ($S_n$), proving algebraic expressions for $S_n$, or solving multi-stage conditions. -> SVG: ""
- Q8: Geometric Constructions (ජ්‍යාමිතික නිර්මාණ) - Step-by-step compass-and-straightedge construction problem (drawing line segments, bisectors, 60°/30°/90° angles, triangles, loci, and tangents to circles). -> MUST INCLUDE SVG DIAGRAM (A clean geometry construction layout with arcs, lines, and vertex points labeled).
- Q9: Mensuration & Logarithms (පරිමාව හා ලඝුගණක) - Volume conservation/conversion between solids (pyramids, cylinders, cones, spheres), proving an algebraic formula like $a^3 = \\frac{\\pi}{2} r^3$, and solving for dimensions using logarithmic tables (Log values). -> MUST INCLUDE SVG DIAGRAM (3D geometry shapes like pyramid/cylinder with labeled dimensions).
- Q10: Plane Geometry / Triangle Theorems (ත්‍රිකෝණ ජ්‍යාමිතිය) - Proving congruency ($\Delta \\equiv \\Delta$), mid-point theorem, parallelograms, and side ratios. -> MUST INCLUDE SVG DIAGRAM (Clear geometric structure with vertices like A, B, C, D, E, F, G, H).
- Q11: Circle Geometry & Tangents (වෘත්ත ජ්‍යාමිතිය) - Cyclic quadrilaterals, tangents, alternate segment theorem, angle subtended at center, and formal step-by-step geometric proofs. -> MUST INCLUDE SVG DIAGRAM (A circle with intersecting chords, secants, tangents, center O, and labeled vertices).
- Q12: Venn Diagrams & Sets (වෙන් සටහන් හා කුලක) - 3-set Venn Diagram problem with real-world context (e.g., student subjects, purchases), completing Venn diagram regions, and solving algebraic set cardinalities. -> MUST INCLUDE SVG DIAGRAM (A clean 3-circle Venn diagram with labels for sets and shaded/unshaded regions).

CRITICAL FORMATTING & RULES:
1. Question Text, Sub-questions, Answers, and Solution steps MUST be written in high-quality, natural Sinhala (සිංහල).
2. Structure sub-questions clearly using subQuestions with subId: "i", "ii", "iii", "iv", "v" or "a", "b", "c".
3. For all math equations, powers, square roots, fractions, and angles, ALWAYS use inline LaTeX enclosed in single dollar signs like $T_n = a + (n-1)d$, $S_n = n(2n+3)$, $\\pi = 3.14$, $30^\\circ$.
4. SVG DIAGRAM RULES:
   - For Q8, Q9, Q10, Q11, and Q12, generate clean, valid, responsive SVG strings inside "svgDiagram".
   - Use standard SVG tags: <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">...</svg>
   - Ensure clean lines (stroke="#1e293b", stroke-width="2"), high readability, crisp geometric shapes, construction arcs, and legible text labels.
`;

    const result: any = await generateWithRetry(model, prompt, 5, 4000);
    const rawText = result.response.text();

    let paperData;
    try {
      paperData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON Parse Error:", rawText);
      return NextResponse.json(
        { success: false, error: "Paper 2 (B කොටස) සෑදීමේදී JSON Format දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න." },
        { status: 500 }
      );
    }

    const cleanedData = sanitizeMathData(paperData);

    return NextResponse.json({ success: true, paper2PartB: cleanedData.paper2PartB });
  } catch (error: any) {
    console.error("Paper 2 Part B API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Paper 2 (B කොටස) සෑදීමේදී දෝෂයක් සිදු විය." },
      { status: error?.status || 500 }
    );
  }
}