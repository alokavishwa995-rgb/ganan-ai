import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function checkAndUpdateLimit(
  userEmail: string,
  featureType: "askQuestions" | "photoScan" | "paperGen"
) {
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  const userRef = adminDb.collection("users").doc(userEmail);
  const userSnap = await userRef.get();

  let userData = userSnap.data();

  // 1. User කෙනෙක් නැත්නම් පළමු වරට Profile එකක් සෑදීම
  if (!userSnap.exists || !userData) {
    userData = {
      email: userEmail,
      plan: "free",
      packageExpiry: null,
      dailyUsage: { askQuestions: 0, photoScan: 0, lastResetDate: todayStr },
      monthlyUsage: { paperGen: 0, lastResetMonth: currentMonthStr },
    };
    await userRef.set(userData);
  }

  // TypeScript Guard
  if (!userData) {
    return { allowed: false, message: "පරිශීලක දත්ත ලබා ගැනීමට නොහැකි විය!" };
  }

  // 2. Paid / Pro Package එක කල් ඉකුත් වී ඇත්දැයි පරීක්ෂා කිරීම
  let packageExpiryDate: Date | null = null;
  if (userData.packageExpiry) {
    if (userData.packageExpiry instanceof Timestamp) {
      packageExpiryDate = userData.packageExpiry.toDate();
    } else if (userData.packageExpiry.toDate) {
      packageExpiryDate = userData.packageExpiry.toDate();
    } else {
      packageExpiryDate = new Date(userData.packageExpiry);
    }
  }

  const isPaid =
    (userData.plan === "paid" || userData.plan === "pro") &&
    packageExpiryDate !== null &&
    packageExpiryDate > new Date();

  // 3. Daily Reset (දවස මාරු වූ විට ගණන් 0 කිරීම)
  let dailyUsage = userData.dailyUsage || { askQuestions: 0, photoScan: 0, lastResetDate: todayStr };
  if (dailyUsage.lastResetDate !== todayStr) {
    dailyUsage = { askQuestions: 0, photoScan: 0, lastResetDate: todayStr };
  }

  // 4. Monthly Reset (මාසය මාරු වූ විට ගණන් 0 කිරීම)
  let monthlyUsage = userData.monthlyUsage || { paperGen: 0, lastResetMonth: currentMonthStr };
  if (monthlyUsage.lastResetMonth !== currentMonthStr) {
    monthlyUsage = { paperGen: 0, lastResetMonth: currentMonthStr };
  }

  // 5. Limit පරීක්ෂාව
  if (featureType === "askQuestions") {
    const maxLimit = isPaid ? 50 : 1; // Free: 2, Paid: 30
    if (dailyUsage.askQuestions >= maxLimit) {
      return { allowed: false, message: `අද දිනට හිමි ප්‍රශ්න ${maxLimit} සීමාව අවසන්!` };
    }
    dailyUsage.askQuestions += 1;
  } 
  else if (featureType === "photoScan") {
    const maxLimit = isPaid ? 50 : 1; // Free: 1, Paid: 20
    if (dailyUsage.photoScan >= maxLimit) {
      return { allowed: false, message: `අද දිනට හිමි Photo Scan ${maxLimit} සීමාව අවසන්!` };
    }
    dailyUsage.photoScan += 1;
  } 
  else if (featureType === "paperGen") {
    
    const maxLimit = isPaid ? 10 : 0;
    
    if (monthlyUsage.paperGen >= maxLimit) {
      return { 
        allowed: false, 
        message: isPaid 
          ? `මෙම මාසයට හිමි Paper ${maxLimit} සීමාව අවසන්!` 
          : "Free මාසික Paper 1 සීමාව අවසන්! තවත් Papers සෑදීමට Pro පැකේජය ලබාගන්න." 
      };
    }
    monthlyUsage.paperGen += 1;
  }

  
  await userRef.update({ dailyUsage, monthlyUsage });
  return { allowed: true };
}