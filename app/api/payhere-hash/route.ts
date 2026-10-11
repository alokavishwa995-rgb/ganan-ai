import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { order_id, amount, currency } = await request.json();

    const merchant_id = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '';
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || '';

    // MD5 Signature Formula
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      useGrouping: false,
    });

    const dataToHash = merchant_id + order_id + amountFormatted + currency + hashedSecret;
    
    const md5Sig = crypto
      .createHash('md5')
      .update(dataToHash)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({ hash: md5Sig, merchant_id });
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}