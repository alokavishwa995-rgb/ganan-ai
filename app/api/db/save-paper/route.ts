import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // ඔයාගේ Firebase config එක තියෙන path එක යොදන්න
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paperTitle, partA, partB, paperType, userEmail } = body;

    const docRef = await addDoc(collection(db, "generated_papers"), {
      userEmail: userEmail || "guest_student",
      paperType,
      paperTitle,
      partA,
      partB,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, paperId: docRef.id });
  } catch (error: any) {
    console.error("Save Paper Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}