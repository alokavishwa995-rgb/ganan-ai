import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "සියලුම තොරතුරු ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();

    // 1. දැනටමත් Verified වූ User කෙනෙක් සිටීදැයි පරීක්ෂා කිරීම
    if (userSnap.exists) {
      const existingData = userSnap.data();
      if (existingData?.isVerified) {
        return NextResponse.json(
          { success: false, message: "මෙම Email එකෙන් දැනටමත් ගිණුමක් සාදා ඇත. ඇතුළු වන්න." },
          { status: 400 }
        );
      }
    }

    // 2. ඉලක්කම් 6ක OTP එකක් generate කිරීම
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // විනාඩි 10ක් වලංගුයි
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().substring(0, 7);

    // 3. Resend හරහා OTP Email එක යැවීම (Error Handling සහිතව)
    try {
      await resend.emails.send({
        from: "ගණිත මිතුරා <onboarding@resend.dev>",
        to: [cleanEmail],
        subject: "ගණිත මිතුරා - Verification Code එක",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #2563eb; text-align: center;">ගණිත මිතුරා 🎓</h2>
            <p>ආයුබෝවන් <b>${cleanName}</b>,</p>
            <p>ගණිත මිතුරා වෙත සාදරයෙන් පිළිගනිමු! ඔයාගේ ලියාපදිංචිය තහවුරු කිරීමට පහත තහවුරු කිරීමේ අංකය (OTP) ඇතුළත් කරන්න:</p>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e293b; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #64748b;">මෙම අංකය විනාඩි 10ක් ඇතුළත කල්ඉක්මවයි.</p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error("Resend Email Send Error:", emailErr);
      return NextResponse.json(
        { 
          success: false, 
          message: "Email එක යැවීමට නොහැකි විය. (Resend Test Mode එකේදී යැවිය හැක්කේ ඔයාගේ Account Email එකට පමණි)." 
        },
        { status: 400 }
      );
    }

    // 4. Firestore හි User Data සහ OTP සේව් කිරීම
    await userRef.set({
      name: cleanName,
      email: cleanEmail,
      password,
      isVerified: false,
      otp,
      otpExpiresAt: expiresAt,
      plan: "free",
      isPaid: false,
      createdAt: new Date().toISOString(),
      dailyUsage: {
        askQuestions: 0,
        photoScan: 0,
        lastResetDate: today,
      },
      monthlyUsage: {
        paperGen: 0,
        lastResetMonth: currentMonth,
      },
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Verification OTP එක Email එකට යවන ලදී.",
    });
  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "ලියාපදිංචි වීමේ දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}