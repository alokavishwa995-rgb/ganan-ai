import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email සහ Password ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();

    // 1. User කෙනෙක් නැත්නම්
    if (!userSnap.exists) {
      return NextResponse.json(
        { success: false, message: "මෙම Email එකෙන් ගිණුමක් හමු නොවීය." },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // 2. Password එක පරීක්ෂා කිරීම
    if (userData?.password !== password) {
      return NextResponse.json(
        { success: false, message: "ඇතුළත් කළ මුරපදය වැරදියි!" },
        { status: 400 }
      );
    }

    // 3. Email එක Verify කරලා නැත්නම් (Flag එකක් සහිතව යැවීම)
    if (!userData?.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          requiresVerification: true,
          message: "ඔබගේ Email එක තවම Verify කර නැත. OTP කේතය ඇතුළත් කරන්න." 
        },
        { status: 401 }
      );
    }

    // 4. Login සාර්ථක නම් User Data ලබා දීම
    return NextResponse.json({
      success: true,
      message: "සාර්ථකව ඇතුළු විය!",
      user: {
        name: userData.name || cleanEmail.split("@")[0],
        email: userData.email || cleanEmail,
        plan: userData.plan || "free",
        isPaid: userData.isPaid || false,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "සර්වර් දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}