"use client";

import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function UpgradeModal({ isOpen, onClose, userEmail }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayHereSubmit = async () => {
    setLoading(true);

    const orderId = `Order_${Date.now()}`;
    const amount = 300.00; // 💡 රු. 300.00 මාසික ගාස්තුව
    const currency = "LKR";

    try {
      // 1. Backend API එකෙන් Hash එක සහ Merchant ID ලබා ගැනීම
      const res = await fetch("/api/payhere-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, currency }),
      });

      if (!res.ok) {
        throw new Error("PayHere Hash ජනනය කරගැනීමට නොහැකි විය.");
      }

      const { hash, merchantId, formattedAmount } = await res.json();

      // App URL එක ලබා ගැනීම (Production live domain හෝ local origin)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      // .env හි NEXT_PUBLIC_PAYHERE_MODE='live' නම් Live URL එකටත් නැතිනම් Sandbox එකටත් යොමු කරයි
      const payhereActionUrl = process.env.NEXT_PUBLIC_PAYHERE_MODE === "live"
        ? "https://www.payhere.lk/pay/checkout"
        : "https://sandbox.payhere.lk/pay/checkout";

      // 2. Dynamic Form එකක් සාදා PayHere Checkout වෙත Submit කිරීම
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payhereActionUrl;

      const params: Record<string, string> = {
        merchant_id: merchantId,
        return_url: `${appUrl}/paper?status=success`,
        cancel_url: `${appUrl}/paper?status=cancel`,
        notify_url: `${appUrl}/api/payhere/notify`, // 👈 Webhook route එක
        order_id: orderId,
        items: "GMath Mithura Pro - මාසික සාමාජිකත්වය (රු. 300)",
        currency: currency,
        amount: formattedAmount,
        hash: hash,
        first_name: "Student",
        last_name: "User",
        email: userEmail || "student@gmail.com",
        phone: "0771234567",
        address: "No 1, Main Street",
        city: "Colombo",
        country: "Sri Lanka",
        custom_1: userEmail, // 👈 Webhook එකේදී Firestore හි User ව සොයාගැනීමට Email එක යැවීම
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
      alert("Payment එක ආරම්භ කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-indigo-50 relative">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
          🚀
        </div>

        <h3 className="text-xl font-extrabold text-slate-800 mb-1">
          Pro Package එකට Upgrade වන්න
        </h3>

        {/* Pricing Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 my-4">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            මාසික සාමාජිකත්වය
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-amber-900">රු. 300</span>
            <span className="text-slate-600 text-sm font-medium">/ මාසයකට</span>
          </div>
        </div>

        {/* Package Features List */}
        <div className="text-left bg-slate-50 p-4 rounded-2xl mb-6 text-xs text-slate-700 space-y-2 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>මසකට ඕනෑම ප්‍රශ්න පත්‍ර 10ක් (Paper 1 / Paper 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>දෛනික AI ප්‍රශ්න ඇසීම් 50ක්</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>දෛනික Photo Scan 50ක්</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>දින 30ක පූර්ණ ප්‍රවේශය (Full Pro Access)</span>
          </div>
        </div>

        <button
          onClick={handlePayHereSubmit}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "PayHere වෙත යොමු වෙමින්..." : "රු. 300 ගෙවා Upgrade වන්න 💳"}
        </button>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 underline mt-4 inline-block"
        >
          පසුව බලන්න
        </button>
      </div>
    </div>
  );
}