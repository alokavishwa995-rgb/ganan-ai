import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, password, isGoogleAuth, uid } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: "නම සහ Email එක අත්‍යවශ්‍ය වේ." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const userRef = adminDb.collection("users").doc(cleanEmail);
    const userSnap = await userRef.get();

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().substring(0, 7);

    // 1. Google Authentication හරහා එන අය සඳහා (Password අත්‍යවශ්‍ය නොවේ)
    if (isGoogleAuth) {
      if (!userSnap.exists) {
        await userRef.set({
          name: cleanName,
          email: cleanEmail,
          uid: uid || null,
          isVerified: true, // Google හරහා එන නිසා Verified ලෙස සලකයි
          plan: "free",
          isPaid: false,
          authProvider: "google",
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
      }

      return NextResponse.json({
        success: true,
        message: "Google හරහා සාර්ථකව ඇතුළු විය.",
      });
    }

    // 2. සාමාන්‍ය Email/Password + OTP ලියාපදිංචිය
    if (!password) {
      return NextResponse.json(
        { success: false, message: "මුරපදයක් (Password) ඇතුළත් කරන්න." },
        { status: 400 }
      );
    }

    // දැනටමත් Verified වූ User කෙනෙක් සිටීදැයි පරීක්ෂා කිරීම
    if (userSnap.exists) {
      const existingData = userSnap.data();
      if (existingData?.isVerified) {
        return NextResponse.json(
          { success: false, message: "මෙම Email එකෙන් දැනටමත් ගිණුමක් සාදා ඇත. ඇතුළු වන්න." },
          { status: 400 }
        );
      }
    }

    // ඉලක්කම් 6ක OTP එකක් generate කිරීම
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // විනාඩි 10යි

    // Resend හරහා OTP Email යැවීම
    try {
      await resend.emails.send({
        from: "ගණිත මිතුරා <noreply@ganan.com.lk>",
        to: [cleanEmail],
        subject: "ගණිත මිතුරා AI - Verification Code එක",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #059669; text-align: center;">ගණිත මිතුරා AI 📐</h2>
            <p style="color: #334155;">ආයුබෝවන් <b>${cleanName}</b>,</p>
            <p style="color: #334155;">ගණිත මිතුරා වෙත සාදරයෙන් පිළිගනිමු! ඔබගේ ලියාපදිංචිය තහවුරු කිරීමට පහත OTP අංකය ඇතුළත් කරන්න:</p>
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #065f46; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #64748b; text-align: center;">මෙම අංකය විනාඩි 10ක් ඇතුළත කල්ඉක්මවයි.</p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error("Resend Email Send Error:", emailErr);
      return NextResponse.json(
        { 
          success: false, 
          message: "Email එක යැවීමට නොහැකි විය. RESEND_API_KEY පරීක්ෂා කරන්න." 
        },
        { status: 400 }
      );
    }

    // Firestore හි User Data සහ OTP සේව් කිරීම
    await userRef.set({
      name: cleanName,
      email: cleanEmail,
      password,
      isVerified: false,
      otp,
      otpExpiresAt: expiresAt,
      plan: "free",
      isPaid: false,
      authProvider: "credentials",
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
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "ලියාපදිංචි වීමේ දෝෂයක් සිදුවිය." },
      { status: 500 }
    );
  }
}