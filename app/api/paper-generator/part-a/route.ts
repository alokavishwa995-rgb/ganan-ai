import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkAndUpdateLimit } from "@/lib/checkLimits";

// ⏱️ Host කිරීමේදී Vercel/Serverless Timeout වීම වැළැක්වීමට Max Duration එක තත්පර 60ක් ලෙස සැකසීම
export const maxDuration = 60; 
export const dynamic = "force-dynamic";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// 🔄 Gemini 503 / 429 Errors සඳහා Auto-Retry කරන Helper Function එක
async function generateWithRetry(model: any, prompt: string, maxRetries = 3, delayMs = 2500) {
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

    // 🛑 2. Paper Generator Limit Check එක
    const limitCheck = await checkAndUpdateLimit(userEmail, "paperGen");
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: limitCheck.message },
        { status: 429 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            partA: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.NUMBER },
                  topic: { type: SchemaType.STRING },
                  questionText: { type: SchemaType.STRING },
                  svgDiagram: { type: SchemaType.STRING },
                  correctAnswer: { type: SchemaType.STRING },
                  solutionSteps: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                  },
                  marks: { type: SchemaType.NUMBER },
                },
                required: [
                  "id",
                  "topic",
                  "questionText",
                  "correctAnswer",
                  "solutionSteps",
                  "marks",
                ],
              },
            },
          },
          required: ["partA"],
        },
      },
    });

    const prompt = `
You are an expert exam paper creator for Sri Lankan G.C.E. O/L Mathematics (Grade 10 and 11 syllabi).
Generate exactly 25 short questions for O/L Mathematics Paper 1 (Part A) following the exact Sri Lankan National Exam syllabus structure.

STRICT QUESTION TOPIC BLUEPRINT (Questions 1 to 25):
- Q1: Percentages / Taxes / Customs Duty / Income Tax / Discounts
- Q2: Algebraic Fractions or Linear Equations
- Q3: Geometry - Triangles (Isosceles, Exterior Angles, Angle sums) -> MUST INCLUDE SVG DIAGRAM
- Q4: Factoring Quadratic Expressions / Expansion
- Q5: Square Root Approximation or Standard Form ($A \\times 10^n$)
- Q6: Circle Geometry - Angle at Center & Circumference -> MUST INCLUDE SVG DIAGRAM
- Q7: Rates, Speed-Time-Work, or Pipe Filling Rate
- Q8: LCM / HCF of Algebraic Terms (e.g., $3x, 6xy, 4x^2y$)
- Q9: Statistics - Histogram / Frequency Polygon -> MUST INCLUDE SVG DIAGRAM
- Q10: Circle Geometry - Cyclic Quadrilaterals / Tangents -> MUST INCLUDE SVG DIAGRAM
- Q11: Logarithms - Logarithmic rules / Indices conversion
- Q12: Geometry - Triangles between Same Parallels (Equal Area) -> MUST INCLUDE SVG DIAGRAM
- Q13: Trigonometry - Angles of Elevation / Depression ($\\tan, \\sin, \\cos$) -> MUST INCLUDE SVG DIAGRAM
- Q14: Matrices - Matrix Addition, Subtraction, or $2 \\times 2$ Multiplication
- Q15: Area and Perimeter of Sectors / Semicircles -> MUST INCLUDE SVG DIAGRAM
- Q16: Loci and Geometric Constructions -> MUST INCLUDE SVG DIAGRAM
- Q17: Probability - Sample Space / Event Probability
- Q18: Simultaneous Linear Equations / Inequalities
- Q19: Geometry - Mid-point Theorem / Intercept Theorem -> MUST INCLUDE SVG DIAGRAM
- Q20: Bearings - North Direction & Angle Measurement -> MUST INCLUDE SVG DIAGRAM
- Q21: Arithmetic Progressions ($T_n = a + (n-1)d$ or $S_n$)
- Q22: Straight Line Equations ($y = mx + c$, Gradient, Intercepts)
- Q23: Set Theory & Venn Diagrams -> MUST INCLUDE SVG DIAGRAM
- Q24: Geometric Progressions / Ratio of Volumes
- Q25: Statistics - Cumulative Frequency / Median Locus -> MUST INCLUDE SVG DIAGRAM

CRITICAL FORMATTING & RULES:
1. Question Text, Answers, and Solution steps MUST be written in high-quality, natural Sinhala (සිංහල).
2. For all math symbols, powers, fractions, and angles, ALWAYS use inline LaTeX enclosed in single dollar signs like $x^2 + 2x = 0$, $\\frac{4}{x}$, $30^\\circ$.
3. SVG DIAGRAM RULES:
   - For questions marked "MUST INCLUDE SVG DIAGRAM", you MUST generate a valid, clean SVG code in string format inside "svgDiagram".
   - Use standard SVG tags: <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">...</svg>
   - All geometric lines must be crisp (stroke="#000000" or "#1e293b", stroke-width="2").
   - Include clear text labels in Sinhala or English letters (A, B, C, D, O, $x$, $130^\circ$) inside the SVG so the diagram makes complete sense.
   - For questions that do NOT require a diagram, keep "svgDiagram" as an empty string ("").
4. Each question carries 2 marks (Total 50 marks).
5. ALWAYS output strictly in valid JSON format as an array of 25 objects:
   [
     {
       "id": 1,
       "question": "ප්‍රශ්නයේ පෙළ සිංහලෙන්...",
       "svgDiagram": "",
       "answer": "අවසාන පිළිතුර...",
       "steps": ["පියවර 1...", "පියවර 2..."]
     },
     ...
   ]
`;

    // 💡 Auto-Retry Function එක හරහා Gemini API Call එක යැවීම
    const result = await generateWithRetry(model, prompt);
    const rawText = result.response.text();

    let paperData;
    try {
      paperData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("JSON Parse Error:", rawText);
      return NextResponse.json(
        { success: false, error: "Paper එක සෑදීමේදී JSON Format දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, partA: paperData.partA });
  } catch (error: any) {
    console.error("Part A API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "A කොටස සෑදීමේදී දෝෂයක් සිදු විය." },
      { status: error?.status || 500 }
    );
  }
}