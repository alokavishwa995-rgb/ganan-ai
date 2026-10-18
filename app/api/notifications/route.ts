import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { notificationId, userEmail } = await request.json();
    
    if (!notificationId || !userEmail) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const docRef = adminDb.collection('notifications').doc(notificationId);
    
    // admin backend එකෙන් update කරන නිසා arrayUnion වෙනුවට මේ ක්‍රමය පාවිච්චි වේ.
    // (firebase-admin වල FieldValue.arrayUnion භාවිතා කිරීමට)
    const { FieldValue } = require('firebase-admin/firestore');
    
    await docRef.update({
      readBy: FieldValue.arrayUnion(userEmail)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark Read Error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}