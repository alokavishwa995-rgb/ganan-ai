"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // LocalStorage එකෙන් හෝ Auth එකෙන් User Email එක ලබා ගැනීම
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  const handlePayHereSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = `Order_${Date.now()}`;
    const amount = 300.00;
    const currency = "LKR";

    try {
      // 1. Backend API එකෙන් Security Hash එක ලබා ගැනීම
      const res = await fetch("/api/payhere-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, currency }),
      });

      const { hash, merchantId, formattedAmount } = await res.json();

      if (!hash || !merchantId) {
        alert("Payment initialization failed. Missing hash or merchantId.");
        setLoading(false);
        return;
      }

      // Live Domain එක Dynamic ලෙස ලබා ගැනීම (Vercel Host වී ඇති Domain එක)
      const appUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "");

      // 2. Dynamic Form එකක් සාදා PayHere Sandbox Checkout එකට Submit කිරීම
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";

      const params: Record<string, string> = {
        merchant_id: String(merchantId), // 👈 String එකක් බවට පත් කිරීම
        return_url: `${appUrl}/chaat?status=success`,
        cancel_url: `${appUrl}/pricing?status=cancel`,
        notify_url: `${appUrl}/api/payhere-notify`,
        order_id: orderId,
        items: "Maths App Monthly Subscription",
        currency: currency,
        amount: String(formattedAmount || "300.00"), // 👈 Backend එකෙන් එන exact string එක
        hash: hash,
        first_name: "Student",
        last_name: "User",
        email: userEmail || "student@gmail.com",
        phone: "0771234567",
        address: "No 1, Main Street",
        city: "Colombo",
        country: "Sri Lanka",
        custom_1: userEmail,
      };

      for (const key in params) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment එක ආරම්භ කිරීමට නොහැකි විය.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">ගණිත මිතුරා Packages</h1>
      <p className="text-slate-500 mb-8">ඔයාට ගැලපෙන Plan එක තෝරාගන්න</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Free Plan Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-700">Free Plan</h2>
            <p className="text-3xl font-extrabold my-4">රු. 0 <span className="text-sm font-normal text-slate-500">/මාසෙට</span></p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li>✅ දවසට Ask Questions 1යි</li>
              <li>✅ දවසට Photo Scan 1යි</li>
              <li>❌ Paper Generator නැත</li>
            </ul>
          </div>
          <button 
            onClick={() => router.push("/chaat")}
            className="w-full bg-slate-200 text-slate-700 font-bold p-3 rounded-xl hover:bg-slate-300 transition"
          >
            දැනට භාවිතා කරන්න
          </button>
        </div>

        {/* Paid Plan Card */}
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
          
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pro Monthly Package</h2>
            <p className="text-3xl font-extrabold text-emerald-600 my-4">රු. 300.00 <span className="text-sm font-normal text-slate-500">/මාසෙට</span></p>
            <ul className="space-y-2 text-sm text-slate-700 mb-6">
              <li>✅ දවසට Ask Questions 50යි</li>
              <li>✅ දවසට Photo Scan 50යි</li>
              <li>✅ මාසෙට Paper Generator 10යි</li>
              <li>✅ Instant AI Help</li>
            </ul>
          </div>

          {/* 🎯 PayHere Checkout Form */}
          <form onSubmit={handlePayHereSubmit}>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "PayHere වෙත යොමු වෙමින්..." : "රු. 300ගෙවා Upgrade වන්න 💳"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}