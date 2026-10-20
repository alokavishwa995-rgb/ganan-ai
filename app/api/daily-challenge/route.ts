export const maxDuration = 60; // තත්පර 60ක උපරිම කාලය

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// දවසේ දිනය ලබා ගැනීම (උදා: "2026-10-18")
const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// 1. අද දවසට අදාළ ප්‍රශ්න 10 ගැනීම හෝ අලුතින් හැදීම
export async function GET() {
  const today = getTodayDateStr();
  const docRef = adminDb.collection('daily_challenges').doc(today);

  try {
    const docSnap = await docRef.get();

    // අද දවසට දැනටමත් ප්‍රශ්න හදලා නම් තියෙන්නේ, ඒක කෙළින්ම දෙනවා (AI එකට යන්නේ නෑ)
    if (docSnap.exists) {
      return NextResponse.json({ success: true, challenge: docSnap.data()?.questions });
    }

    // අද දවසට ප්‍රශ්න නැත්නම් (පළවෙනි ළමයා ආවම), අලුතින් ප්‍රශ්න 10ක් හදනවා
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
    const prompt = `
      ඔබ ශ්‍රී ලංකාවේ සාමාන්‍ය පෙළ (O/L) ගණිත ගුරුවරයෙකි.
      අද දවසේ අභියෝගය සඳහා O/L විෂය නිර්දේශයෙන් (වීජ ගණිතය, ජ්‍යාමිතිය, කුලක, ප්‍රතිශත ආදී) 
      කෙටි ප්‍රශ්න 10ක් සිංහල මාධ්‍යයෙන් සාදන්න. 
      හැම ප්‍රශ්නයකටම උත්තර 4ක් (MCQ) ලබා දෙන්න.

      පහත දැක්වෙන JSON ආකෘතියෙන් පමණක් පිළිතුර ලබා දෙන්න (වෙනත් කිසිදු අකුරක් එපා):
      [
        {
          "id": 1,
          "question": "ප්‍රශ්නය මෙතනින්...",
          "options": ["A උත්තරය", "B උත්තරය", "C උත්තරය", "D උත්තරය"],
          "correctAnswer": "A උත්තරය"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON කොටස පමණක් වෙන් කරගැනීම
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("JSON Parse Error");
    
    const questions = JSON.parse(jsonMatch[0]);

    // හදපු ප්‍රශ්න 10 Database එකේ සේව් කිරීම (අනිත් අයට පෙන්වන්න)
    await docRef.set({ questions, createdAt: new Date().toISOString() });

    return NextResponse.json({ success: true, challenge: questions });

  } catch (error) {
    console.error("Daily Challenge Error:", error);
    return NextResponse.json({ success: false, error: "අද දවසේ අභියෝගය සකස් කිරීමට නොහැකි විය." }, { status: 500 });
  }
}

// 2. ළමයාගේ උත්තර පරික්ෂා කර ලකුණු ලබාදීම සහ Leaderboard එකට දැමීම
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

    // Leaderboard එකට ළමයාගේ දත්ත දැමීම
    const leaderboardRef = docRef.collection('leaderboard').doc(userEmail);
    await leaderboardRef.set({
      name: userName,
      email: userEmail,
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

  } catch (error) {
    console.error("Score Submit Error:", error);
    return NextResponse.json({ success: false, error: "ලකුණු ඇතුළත් කිරීම අසාර්ථක විය." }, { status: 500 });
  }
}