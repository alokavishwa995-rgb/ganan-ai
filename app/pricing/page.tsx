"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

export default function PricingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);

    // 💡 PayHere එකෙන් සල්ලි ගෙවලා return_url එක හරහා ආපහු මේ පිටුවට ආවම
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");
    const returnEmail = searchParams.get("email") || email;

    if (status === "success" && returnEmail) {
      fetch("/api/upgrade-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: returnEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("🎉 ඔබගේ ගෙවීම සාර්ථකයි! Pro Package එක Active විය.");
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push("/chaat");
          }
        })
        .catch((err) => {
          console.error("Upgrade Error:", err);
          alert("Upgrade කිරීමේදී දෝෂයක් මතු විය!");
        });
    } else if (status === "cancel") {
      alert("❌ ගෙවීම අවලංගු කරන ලදී.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [router]);

  const handlePaymentClick = () => {
    if (!userEmail) {
      alert("කරුණාකර පළමුව ගිණුමට ඇතුළු වන්න (Login වන්න)!");
      router.push("/login");
      return;
    }
    setShowUpgradeModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-10 font-sans">
      {/* Top Back Navigation */}
      <div className="max-w-4xl w-full mb-6 flex justify-between items-center">
        <Link
          href="/login"
          className="text-emerald-400 text-sm font-semibold hover:underline flex items-center gap-1"
        >
          ← Back to Account / Login
        </Link>
        <span className="text-xs font-semibold text-slate-400">GanithaMithura AI</span>
      </div>

      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ගණිත මිතුරා Packages
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          ඔබට ගැළපෙන සාමාජිකත්වය තෝරාගන්න (Plans & Pricing)
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full items-stretch">
        
        {/* 1. Free Plan Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-xl border border-slate-100 flex flex-col justify-between text-center">
          <div>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              📘
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Free Package (නොමිලේ)
            </h2>

            {/* Soft Slate Price Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-5">
              <p className="text-xs font-semibold text-slate-500 mb-1">
                මූලික සාමාජිකත්වය
              </p>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-800">
                  රු. 0
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  / මාසයකට
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">
                (LKR 0.00 / Month)
              </p>
            </div>

            {/* Features Box */}
            <div className="bg-slate-50/80 rounded-2xl p-4 text-left space-y-2.5 mb-6 border border-slate-100">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දෛනික AI ප්‍රශ්න ඇසීම (දිනකට 1යි)</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දෛනික Photo Scan (දිනකට 1යි)</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>මූලික ගණිත සූත්‍ර සහ පාඩම් පරිශීලනය</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => router.push("/chaat")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-3.5 rounded-2xl transition-all text-sm cursor-pointer"
            >
              නොමිලේ භාවිතා කරන්න
            </button>
          </div>
        </div>

        {/* 2. Pro Package Card (Matching Screenshot Design) */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-2xl border-2 border-amber-200/80 flex flex-col justify-between text-center relative overflow-hidden">
          <div>
            {/* Rocket Badge */}
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
              🚀
            </div>

            <h2 className="text-xl font-extrabold text-slate-800">
              Pro Package එකට Upgrade වන්න
            </h2>

            {/* Warm Amber / Cream Price Box (From Screenshot) */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 my-5">
              <p className="text-xs font-bold text-amber-700 mb-1">
                මාසික සාමාජිකත්වය
              </p>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#78350F]">
                  රු. 300
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  / මාසයකට
                </span>
              </div>
              <p className="text-[11px] font-bold text-amber-800/70 mt-1">
                (LKR 300.00 / Month)
              </p>
            </div>

            {/* Features Box (Exact Items from Screenshot) */}
            <div className="bg-slate-50/90 rounded-2xl p-4 text-left space-y-2.5 mb-6 border border-slate-100">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දෛනික AI ප්‍රශ්න ඇසීම Unlimited</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දෛනික Photo Scan Unlimited</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දවසේ අභියෝගය (Daily Challenge) සීමා රහිත ප්‍රවේශය</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>දින 30ක පූර්ණ ප්‍රවේශය (Full Pro Access)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePaymentClick}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold p-3.5 sm:p-4 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>රු. 300 ගෙවා Upgrade වන්න</span>
              <span>💳</span>
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
            >
              පසුව බලන්න
            </button>
          </div>
        </div>

      </div>

      {/* PayHere Compliance Legal Footer */}
      <div className="mt-8 pt-4 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-400">
        <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-emerald-400 transition-colors">
          Terms & Conditions
        </Link>
        <span>•</span>
        <Link href="/refund" className="hover:text-emerald-400 transition-colors">
          Refund Policy
        </Link>
      </div>

      {/* Upgrade Modal Component */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userEmail={userEmail}
      />
    </div>
  );
}