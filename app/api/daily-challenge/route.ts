export const maxDuration = 60; // තත්පර 60ක උපරිම කාලය

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// 🔒 Vercel AI SDK එකට API Key එක සම්බන්ධ කිරීම
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// දවසේ දිනය ලබා ගැනීම (උදා: "2026-10-22")
const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// 🎯 Vercel AI SDK සඳහා Zod Schema එක (ප්‍රශ්න 10 හි ආකෘතිය)
const dailyChallengeSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      category: z.string(),
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctAnswer: z.string(),
      svgDiagram: z.string().optional().describe('ජ්‍යාමිතිය, ප්‍රස්තාර, මිනුම් හෝ ත්‍රිකෝණමිතිය සඳහා අවශ්‍ය නම් පමණක් පිරිසිදු <svg>...</svg> කේතය ලබා දෙන්න, නැතහොත් හිස්ව තබන්න.'),
    })
  ).length(10),
});

// ----------------------------------------------------
// 1. GET: අද දවසට අදාළ ප්‍රශ්න 10 ගැනීම හෝ අලුතින් හැදීම
// ----------------------------------------------------
export async function GET() {
  const today = getTodayDateStr();
  const docRef = adminDb.collection('daily_challenges').doc(today);

  try {
    const docSnap = await docRef.get();

    // අද දවසට දැනටමත් ප්‍රශ්න හදලා නම් තියෙන්නේ, ඒක කෙළින්ම දෙනවා (AI එකට යන්නේ නෑ)
    if (docSnap.exists) {
      return NextResponse.json({ success: true, challenge: docSnap.data()?.questions });
    }

    // 🎯 අද දවසට ප්‍රශ්න නැත්නම් (පළවෙනි ළමයා ආවම), O/L ආකෘතියට ප්‍රශ්න 10ක් හදනවා
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: dailyChallengeSchema,
      prompt: `
        ඔබ ශ්‍රී ලංකා අ.පො.ස. සාමාන්‍ය පෙළ (O/L) ගණිත ගුරුවරයා වේ.
        අද දවසේ Daily Challenge එක සඳහා O/L ගණිතය 1 වන ප්‍රශ්න පත්‍රයේ ආකෘතියට අනුකූලව පහත සඳහන් මාතෘකා 10න් පිළිවෙළින් MCQ ප්‍රශ්න 10ක් සාදන්න:

        1 වෙනි ප්‍රශ්නය - සංඛ්‍යා (HCF/LCM, වර්ගමූලය, දළ ගණනය, හෝ සම්මත ආකාරය)
        2 වෙනි ප්‍රශ්නය - මුදල් හා වාණිජ ගණිතය (ප්‍රතිශතය, අනුපාතය, ලාභ-අලාභ, කොමිස්, හෝ පොලී)
        3 වෙනි ප්‍රශ්නය - වීජ ගණිතය 1 (සාධක කිරීම, වීජීය ප්‍රකාශන, හෝ දර්ශක නීති)
        4 වෙනි ප්‍රශ්නය - වීජ ගණිතය 2 (සමීකරණ, අසමීකරණ, හෝ කුලක)
        5 වෙනි ප්‍රශ්නය - ජ්‍යාමිතිය 1 (කෝණ, ත්‍රිකෝණ, සිව්කොන්, සමාන්තරාසර කෝණ) -> අවශ්‍ය නම් <svg> රූපසටහනක් එකතු කරන්න.
        6 වෙනි ප්‍රශ්නය - ජ්‍යාමිතිය 2 (පරිමිතිය, වර්ගඵලය, හෝ පයිතගරස් ප්‍රමේයය) -> අවශ්‍ය නම් <svg> රූපසටහනක් එකතු කරන්න.
        7 වෙනි ප්‍රශ්නය - ප්‍රස්තාර (සරල රේඛා ප්‍රස්තාර, ශ්‍රිත, හෝ ඛණ්ඩාංක) -> අවශ්‍ය නම් <svg> රූපසටහනක් එකතු කරන්න.
        8 වෙනි ප්‍රශ්නය - ත්‍රිකෝණමිතිය (sin, cos, tan, උන්නතාංශ/අවනතාංශ) -> අවශ්‍ය නම් <svg> රූපසටහනක් එකතු කරන්න.
        9 වෙනි ප්‍රශ්නය - මිනුම් (සිලින්ඩර, කේතු, ගෝල, හෝ ඝනක පරිමාව/වර්ගඵලය) -> අවශ්‍ය නම් <svg> රූපසටහනක් එකතු කරන්න.
        10 වෙනි ප්‍රශ්නය - දත්ත හා සම්භාවිතාව (සංඛ්‍යාලේඛන, මධ්‍යන්‍ය, මාධ්‍යස්ථ, හෝ සම්භාවිතාව)

        නීති රීති:
        - සියලුම ප්‍රශ්න, ප්‍රකාශන සහ පිළිතුරු 100%ක් පිරිසිදු සිංහල භාෂාවෙන් තිබිය යුතුය.
        - ගණිතමය සූත්‍ර සඳහා KaTeX/LaTeX ආකෘතිය ($...$ හෝ $$...$$) භාවිත කරන්න.
        - සෑම ප්‍රශ්නයකටම වෙනස් වෙනස් උත්තර 4ක් (options) ලබාදී, නිවැරදි උත්තරය correctAnswer ලෙස සටහන් කරන්න.
        - 5, 6, 7, 8, 9 යන ප්‍රශ්න සඳහා රූපසටහනක් පැහැදිලි කිරීමට අවශ්‍ය නම් පමණක් svgDiagram සඳහා පිරිසිදු HTML <svg>...</svg> කේතය ලබා දෙන්න.
      `,
    });

    const questions = object.questions;

    // හදපු ප්‍රශ්න 10 Database එකේ සේව් කිරීම (අනිත් අයට පෙන්වන්න)
    await docRef.set({ questions, createdAt: new Date().toISOString() });

    return NextResponse.json({ success: true, challenge: questions });

  } catch (error: any) {
    console.error("Daily Challenge Error:", error?.message || error);
    return NextResponse.json({ success: false, error: "අද දවසේ අභියෝගය සකස් කිරීමට නොහැකි විය." }, { status: 500 });
  }
}

// ----------------------------------------------------
// 2. POST: ළමයාගේ උත්තර පරික්ෂා කර ලකුණු ලබාදීම සහ Leaderboard එකට දැමීම
// ----------------------------------------------------
export async function POST(request: Request) {
  try {
    const { userEmail, userName, userAnswers, timeSpent } = await request.json();
    const today = getTodayDateStr();
    
    const docRef = adminDb.collection('daily_challenges').doc(today);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ success: false, error: "අභියෝගය සොයාගත නොහැක." }, { status: 400 });
    }

    const questions = docSnap.data()?.questions;
    let score = 0;

    // ලකුණු ගණනය කිරීම
    questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 10; // එක ප්‍රශ්නයකට ලකුණු 10යි (මුළු ලකුණු 100)
      }
    });

    const cleanEmail = userEmail.trim().toLowerCase();

    // Leaderboard එකට ළමයාගේ දත්ත දැමීම
    const leaderboardRef = docRef.collection('leaderboard').doc(cleanEmail);
    await leaderboardRef.set({
      name: userName || "Student",
      email: cleanEmail,
      score: score,
      timeSpent: timeSpent, // තත්පර ගණන
      submittedAt: new Date().toISOString()
    });

    // දැනට තියෙන හොඳම ළමයි 10 දෙනා ගැනීම (Score එකෙන් වැඩිම, වෙලාවෙන් අඩුම)
    const topPlayersSnap = await docRef.collection('leaderboard')
      .orderBy('score', 'desc')
      .orderBy('timeSpent', 'asc')
      .limit(10)
      .get();

    const leaderboard = topPlayersSnap.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, score, leaderboard });

  } catch (error: any) {
    console.error("Score Submit Error:", error?.message || error);
    return NextResponse.json({ success: false, error: "ලකුණු ඇතුළත් කිරීම අසාර්ථක විය." }, { status: 500 });
  }
}