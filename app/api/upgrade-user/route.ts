import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); 
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const currentDayStr = new Date().toISOString().slice(0, 10);

    const userRef = adminDb.collection("users").doc(email);

    // Database එක Auto Pro වලට Update කරනවා
    await userRef.set(
      {
        plan: "pro",
        isPaid: true,
        packageExpiry: Timestamp.fromDate(expiryDate),
        lastPaymentDate: Timestamp.fromDate(new Date()),
        dailyUsage: {
          askQuestions: 0,
          photoScans: 0,
          lastResetDate: currentDayStr,
        },
        monthlyUsage: {
          paperGen: 0,
          paper1Count: 0,
          paper2Count: 0,
          lastResetMonth: currentMonthStr,
        },
        limits: {
          maxDailyQuestions: 50,
          maxDailyScans: 50,
          maxMonthlyPapers: 10,
        }
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Upgrade Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}