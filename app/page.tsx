"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [userName, setUserName] = useState<string>("මිතුරා"); 
  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // LocalStorage inda user email & name tagolodu
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');

    if (!savedEmail) {
      router.push('/login');
      return;
    }

    setUserEmail(savedEmail);
    if (savedName) {
      setUserName(savedName.split(" ")[0]);
    }
  }, [router]);

  const features = [
    { 
      title: "AI ගණිත ගුරු", 
      desc: "ඔබේ ප්‍රශ්න වලට AI ගුරුගෙන් පිළිතුරු ලබා ගන්න.", 
      icon: "🤖", 
      gradient: "from-blue-500 via-indigo-500 to-cyan-400",
      link: "/chaat" 
    },
    { 
      title: "Photo Scan", 
      desc: "පත්‍රිකාවේ ප්‍රශ්නය ඡායාරූප කර AI මගින් විශ්ලේෂණය කරන්න.", 
      icon: "📸", 
      gradient: "from-emerald-500 via-teal-500 to-green-400",
      link: "/scanner" 
    },
    { 
      title: "Theorems", 
      desc: "ගණිතමය නීති හා සූත්‍ර සමූහය.", 
      icon: "📐", 
      gradient: "from-indigo-500 via-purple-500 to-violet-400",
      link: "/formulas" 
    },
    { 
      title: "Past Papers", 
      desc: "පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ පිළිතුරු.", 
      icon: "📜", 
      gradient: "from-amber-500 via-orange-500 to-yellow-400",
      link: "/pastpapers" 
    },
    { 
      title: "Daily Quiz", 
      desc: "දිනපතා කුඩා ප්‍රශ්න මාලා ඇසීමෙන් ඔබේ දැනුම පරික්ෂා කරන්න.", 
      icon: "🏆", 
      gradient: "from-rose-500 via-pink-500 to-red-400",
      link: "/daily-challenge" 
    },
    { 
      title: "Auto Graph", 
      desc: "ගණිතමය දත්ත වලින් ග්‍රාෆ් සෑදීම හොඳින් කරගන්න.", 
      icon: "📈", 
      gradient: "from-cyan-500 via-blue-600 to-teal-400",
      link: "/grader" 
    },
  ];

  if (!isClient) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-[#f0f4fb]'}`}></div>;
  }

  return (
    <main className={`min-h-screen pb-10 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#f0f4fb] text-slate-900'}`}>
      
      {/* --- Header with Curved Design --- */}
      <div className={`pt-10 pb-8 px-6 rounded-b-[36px] shadow-2xl relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800' 
          : 'bg-gradient-to-br from-[#0c1436] via-[#121c48] to-[#1a265c]'
      }`}>
        
        {/* Ambient Light Effects */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 backdrop-blur-md mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-blue-200 text-xs font-semibold tracking-wide">ආයුබෝවන්, {userName}!</p>
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 tracking-tight">
              ගණිත මිතුරා
            </h1>
            <p className="text-blue-200/80 text-xs mt-1 font-normal max-w-[200px] leading-relaxed">
              ඔබේ ගණිත ගමනේ හොඳම මිතුරා!
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
              <button 
                onClick={toggleDarkMode}
                type="button"
                className="w-10 h-10 bg-white/10 text-white rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all shadow-lg"
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                <span className="text-base">{isDarkMode ? "☀️" : "🌙"}</span>
              </button>
              <NotificationDropdown userEmail={userEmail} />
            </div>
            
            {/* 🤖 Modern 3D AI Robot Avatar Badge (Replaced Image Logo) */}
            <div className="relative w-13 h-13 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center backdrop-blur-md">
                <span className="text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">🤖</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Grid Menu Cards --- */}
      <div className="p-5 grid grid-cols-2 gap-4.5 mt-4 relative z-20">
        {features.map((f, i) => (
          <Link 
            key={i} 
            href={f.link}
            className={`p-4.5 rounded-[28px] transition-all duration-300 flex flex-col justify-between relative border backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95 group overflow-hidden ${
              isDarkMode 
                ? 'bg-slate-900/90 border-slate-800/80 text-white hover:border-slate-700' 
                : 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-300 shadow-slate-200/60'
            }`}
          >
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`}></div>

            <div>
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl mb-3.5 shadow-md bg-gradient-to-br ${f.gradient} text-white transition-transform group-hover:scale-105`}>
                <span className="drop-shadow-sm">{f.icon}</span>
              </div>
              
              <h3 className={`font-extrabold text-base mb-1 tracking-tight transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {f.title}
              </h3>
              
              <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {f.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}