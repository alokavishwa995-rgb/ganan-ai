import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "කරුණාකර Email ලිපිනය ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { success: false, message: "මෙම Email එකෙන් ගිණුමක් හමු නොවීය." },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // Google මඟින් register වූ අයදුම්කරුවන්ට password නැති නිසා
    if (!userData?.password) {
      return NextResponse.json(
        { success: false, message: "මෙම ගිණුම Google Login හරහා සාදා ඇත. කරුණාකර Google මඟින් ඇතුළු වන්න." },
        { status: 400 }
      );
    }

    // OTP එකක් generate කිරීම (විනාඩි 10ක් වලංගුයි)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Resend හරහා Email එක යැවීම
    try {
      await resend.emails.send({
        from: "ගණිත මිතුරා <noreply@ganan.com.lk>",
        to: [cleanEmail],
        subject: "ගණිත මිතුරා AI - Password Reset OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #2563eb; text-align: center;">ගණිත මිතුරා AI 📐</h2>
            <p style="color: #334155;">ආයුබෝවන්,</p>
            <p style="color: #334155;">ඔබගේ ගිණුමේ මුරපදය (Password) වෙනස් කිරීමට ඉල්ලුම් කර ඇත. පහත OTP කේතය ඇතුළත් කරන්න:</p>
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #64748b; text-align: center;">මෙම අංකය විනාඩි 10ක් ඇතුළත කල්ඉක්මවයි.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Resend Error:", emailErr);
      return NextResponse.json(
        { success: false, message: "Email එක යැවීමට නොහැකි විය. නැවත උත්සාහ කරන්න." },
        { status: 400 }
      );
    }

    // Firestore හි OTP එක save කිරීම
    await userRef.update({
      otp,
      otpExpiresAt: expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: "Password Reset OTP එක ඔබගේ Email එකට යවන ලදී.",
    });
  } catch (error: any) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "සර්වර් දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}