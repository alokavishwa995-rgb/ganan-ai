import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { orderId, amount, currency } = await req.json();

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Environment Variables තිබේදැයි පරීක්ෂා කිරීම
    if (!merchantId || !merchantSecret) {
      console.error("PayHere Merchant ID or Secret is missing in environment variables.");
      return NextResponse.json(
        { error: "PayHere configuration missing" },
        { status: 500 }
      );
    }

    // Amount එක අනිවාර්යයෙන්ම දශම ස්ථාන 2ක් විය යුතුය (eg: "250.00")
    const formattedAmount = Number(amount).toFixed(2);

    // 1. Merchant Secret එක MD5 කර Uppercase කිරීම
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // 2. Main Hash String එක සැකසීම
    const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;

    // 3. Main Hash එක MD5 කර Uppercase කිරීම
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