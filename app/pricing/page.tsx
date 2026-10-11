"use client";

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
      // ඩේටාබේස් එක Pro Package එකට Update කිරීම
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
            router.push("/chaat"); // Chat එකට යැවීම
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
    // 💡 Upgrade Modal එක පෙන්වීම (මෙය මඟින් Hash සහ නිවැරදි විස්තර PayHere වෙත යවයි)
    setShowUpgradeModal(true);
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
            className="w-full bg-slate-200 text-slate-700 font-bold p-3 rounded-xl hover:bg-slate-300 transition cursor-pointer"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl shadow-md transition cursor-pointer"
          >
            රු. 300 ගෙවා Upgrade වන්න 💳
          </button>
        </div>
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