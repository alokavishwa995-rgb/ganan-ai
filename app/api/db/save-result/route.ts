import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { paperType, totalMarks, earnedMarks, timeSpent, studentAnswers } = await req.json();

    const docRef = await addDoc(collection(db, "student_results"), {
      userId: "guest_student", // පස්සේ Auth දැම්මම මේක මාරු කරන්න පුළුවන්
      paperType,
      totalMarks,
      earnedMarks,
      timeSpent, // ගතවූ කාලය තත්පර වලින්
      studentAnswers,
      submittedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, resultId: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}