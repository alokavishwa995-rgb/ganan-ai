import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchant_id = formData.get('merchant_id')?.toString() || '';
    const order_id = formData.get('order_id')?.toString() || '';
    const payhere_amount = formData.get('payhere_amount')?.toString() || '';
    const payhere_currency = formData.get('payhere_currency')?.toString() || '';
    const status_code = formData.get('status_code')?.toString() || '';
    const md5sig = formData.get('md5sig')?.toString() || '';
    
    // 🎯 PayHere එකෙන් email එක එවන්නේ custom_1 හරහායි.
    const email = formData.get('custom_1')?.toString() || formData.get('email')?.toString() || ''; 

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || '';

    // PayHere Notify MD5 Signature Verification Formula
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase();

    const localMd5Sig = crypto
      .createHash('md5')
      .update(
        merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        hashedSecret
      )
      .digest('hex')
      .toUpperCase();

    // Status code '2' කියන්නේ Successful Payment එකකටයි
    if (localMd5Sig === md5sig && status_code === '2') {
      if (email) {
        const cleanEmail = email.trim().toLowerCase();
        const userRef = adminDb.collection('users').doc(cleanEmail);
        
        // 🎯 update වෙනුවට set({ merge: true }) දැමීම (User doc එක නැතිනම් එය ඉබේම සැකසේ)
        await userRef.set({
          isPaid: true,
          plan: 'pro',
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        console.log(`Payment successful and user upgraded: ${cleanEmail}`);
      } else {
        console.warn('Payment successful but no email found in custom_1.');
      }
    } else {
      console.warn('Payment signature verification failed or status is not 2.');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('PayHere Notify Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}