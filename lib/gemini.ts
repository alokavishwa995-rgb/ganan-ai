import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔒 Server-side API key එක (NEXT_PUBLIC_ නැතිව)
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt, imageBase64 } = await req.json();

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: "කරුණාකර ප්‍රශ්නයක් හෝ ඡායාරූපයක් ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    // 🎯 O/L ගණිත ගුරු System Instruction එක සහිත Model එක
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "ඔයා ලංකාවේ O/L ගණිත ගුරුවරයෙක්. ශිෂ්‍යයෙක් අහන ප්‍රශ්න වලට පියවරෙන් පියවර, සරල සිංහලෙන් පැහැදිලි කරන්න. ගණිතමය සූත්‍ර ලියද්දී පැහැදිලිව පෙන්වන්න. හැඩතල ගැන්වීම (කළ යුතුම දෙයක්): කිසිම විටෙක LaTeX කේත, '$' සංකේත හෝ '\\frac' වැනි කේත භාවිතා නොකරන්න.",
    });

    let result;

    if (imageBase64) {
      // 📸 රූපයක් (Photo Scan) සහිත ප්‍රශ්නයක් නම්
      const base64Data = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      };

      result = await model.generateContent([
        prompt || "මෙම ගණිත ප්‍රශ්නය පියවරෙන් පියවර විසඳන්න.",
        imagePart,
      ]);
    } else {
      // 📝 Text ප්‍රශ්නයක් පමණක් නම්
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, error: "ගණිත ප්‍රශ්නය විසඳීමට නොහැකි විය. නැවත උත්සාහ කරන්න." },
      { status: 500 }
    );
  }
}