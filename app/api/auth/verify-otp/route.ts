import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "විස්තර අසම්පූර්ණයි." },
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

    // 1. Expiry Time එක පරීක්ෂා කිරීම
    if (userData?.otpExpiresAt && Date.now() > userData.otpExpiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP කේතයේ කාලය ඉකුත් වී ඇත. නැවත එකක් ලබාගන්න." },
        { status: 400 }
      );
    }

    // 2. OTP එක පරීක්ෂා කිරීම
    if (String(userData?.otp).trim() !== cleanOtp) {
      return NextResponse.json(
        { success: false, message: "ඇතුළත් කළ OTP එක වැරදියි!" },
        { status: 400 }
      );
    }

    // 3. Admin SDK හරහා Status එක Verified ලෙස Update කිරීම
    await userRef.update({
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    });

    // 4. Verification සාර්ථක වූ පසු User විස්තර Frontend එක වෙත ලබා දීම
    return NextResponse.json({
      success: true,
      message: "ඊමේල් ගිණුම සාර්ථකව තහවුරු විය!",
      user: {
        name: userData?.name || cleanEmail.split("@")[0],
        email: cleanEmail,
        plan: userData?.plan || "free",
        isPaid: userData?.isPaid || false,
      },
    });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "තහවුරු කිරීමේ දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}