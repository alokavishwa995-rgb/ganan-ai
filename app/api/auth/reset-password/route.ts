import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "සියලුම තොරතුරු ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { success: false, message: "ගිණුමක් හමු නොවීය." },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // OTP Expiry check
    if (userData?.otpExpiresAt && Date.now() > userData.otpExpiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP කේතයේ කාලය ඉකුත් වී ඇත. නැවත උත්සාහ කරන්න." },
        { status: 400 }
      );
    }

    // OTP match check
    if (String(userData?.otp).trim() !== cleanOtp) {
      return NextResponse.json(
        { success: false, message: "ඇතුළත් කළ OTP එක වැරදියයි!" },
        { status: 400 }
      );
    }

    // Password Update කර OTP ඉවත් කිරීම
    await userRef.update({
      password: newPassword,
      otp: null,
      otpExpiresAt: null,
    });

    return NextResponse.json({
      success: true,
      message: "මුරපදය සාර්ථකව වෙනස් කරන ලදී! දැන් ඔබට Login විය හැක.",
    });
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}