"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);

    // 💡 PayHere එකෙන් සල්ලි ගෙවලා ආපහු මේ පිටුවට ආවම ක්‍රියාත්මක වෙන කොටස
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("status") === "success") {
      const pendingPayment = localStorage.getItem("pendingPayment");
      
      if (pendingPayment === "true" && email) {
        setLoading(true);
        // අලුත් API එකට කතා කරලා Database එක Update කරනවා
        fetch("/api/upgrade-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        })
          .then(() => {
            localStorage.removeItem("pendingPayment"); // Flag එක අයින් කරනවා
            alert("🎉 ඔබගේ ගෙවීම සාර්ථකයි! Pro Package එක Active විය.");
            router.push("/chaat"); // Chaat එකට යවනවා
          })
          .catch(() => {
            alert("Upgrade කිරීමේදී දෝෂයක් මතු විය!");
            setLoading(false);
          });
      }
    }
  }, [router]);

  const handlePaymentClick = () => {
    if (!userEmail) {
      alert("කරුණාකර පළමුව ලොග් වී සිටින්න!");
      return;
    }
    // 💡 ගෙවන්න යන්න කලින් බලාපොරොත්තු වෙනවා කියලා ලකුණු කරගන්නවා
    localStorage.setItem("pendingPayment", "true");
    
    // PayHere Link එකට යවනවා
    window.location.href = "https://sandbox.payhere.lk/pay/oc6f49a78";
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

          <button 
            onClick={handlePaymentClick}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Update වෙමින් පවතී..." : "රු. 300 ගෙවා Upgrade වන්න 💳"}
          </button>
        </div>
      </div>
    </div>
  );
}