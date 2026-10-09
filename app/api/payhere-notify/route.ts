import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const merchantId = formData.get("merchant_id") as string;
    const orderId = formData.get("order_id") as string;
    const payhereAmount = formData.get("payhere_amount") as string;
    const payhereCurrency = formData.get("payhere_currency") as string;
    const statusCode = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;
    const userEmail = formData.get("custom_1") as string; // UpgradeModal එකෙන් එවූ Email එක

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";

    // 1. PayHere Security Signature (md5sig) සාදා පරීක්ෂා කිරීම
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const hashString =
      merchantId +
      orderId +
      payhereAmount +
      payhereCurrency +
      statusCode +
      hashedSecret;

    const localMd5sig = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    // 2. Signature එක 100% Match සහ status_code == "2" (Payment Success) නම් පමණක් DB Update කිරීම
    if (localMd5sig === md5sig && statusCode === "2" && userEmail) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // අද සිට දින 30ක කාලයක් ලබා දීම
      const currentMonthStr = new Date().toISOString().slice(0, 7);

      const userRef = adminDb.collection("users").doc(userEmail);

      // 💡 Firebase Admin DB හරහා User Document එක ආරක්ෂිතව Merge/Update කිරීම
      await userRef.set(
        {
          plan: "pro",
          isPaid: true,
          packageExpiry: Timestamp.fromDate(expiryDate),
          lastPaymentDate: Timestamp.fromDate(new Date()),
          lastOrderId: orderId,
          // 💡 ගෙවීම් කළ සැනින් මාසික ප්‍රශ්න පත්‍ර ගණන 0 කර නව සීමාව ලබා දීම
          monthlyUsage: {
            paperGen: 0,
            paper1Count: 0,
            paper2Count: 0,
            lastResetMonth: currentMonthStr,
          },
        },
        { merge: true }
      );

      return NextResponse.json({
        success: true,
        message: "Package Upgraded Successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid Signature or Payment Failed" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("PayHere Webhook Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Webhook Processing Error" },
      { status: 500 }
    );
  }
}