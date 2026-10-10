import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { orderId, amount, currency } = await req.json();

    // 🛑 .trim() භාවිතා කර අනවශ්‍ය Spaces ඉවත් කිරීම (අනිවාර්යයි)
    const merchantId = (process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || "").trim();
    const merchantSecret = (process.env.PAYHERE_MERCHANT_SECRET || "").trim();

    if (!merchantId || !merchantSecret) {
      console.error("PayHere Merchant ID or Secret is missing in environment variables.");
      return NextResponse.json(
        { error: "PayHere configuration missing" },
        { status: 500 }
      );
    }

    const formattedAmount = Number(amount).toFixed(2);

    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;

    const hash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    return NextResponse.json({ hash, merchantId, formattedAmount });
  } catch (error) {
    console.error("Hash generation error:", error);
    return NextResponse.json({ error: "Hash generation failed" }, { status: 500 });
  }
}