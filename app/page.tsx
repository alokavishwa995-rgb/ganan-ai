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
    // Firebase auth වෙනුවට localStorage පාවිච්චි කිරීම
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
      glowBg: "bg-blue-500/10 border-blue-200 dark:border-blue-900/60",
      link: "/chaat" 
    },
    { 
      title: "Photo Scan", 
      desc: "පත්‍රිකාවේ ප්‍රශ්නය ඡායාරූප කර AI මගින් විශ්ලේෂණය කරන්න.", 
      icon: "📸", 
      gradient: "from-emerald-500 via-teal-500 to-green-400",
      glowBg: "bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/60",
      link: "/scanner" 
    },
    { 
      title: "Theorems", 
      desc: "ගණිතමය නීති හා සූත්‍ර සමූහය.", 
      icon: "📐", 
      gradient: "from-indigo-500 via-purple-500 to-violet-400",
      glowBg: "bg-indigo-500/10 border-indigo-200 dark:border-indigo-900/60",
      link: "/formulas" 
    },
    { 
      title: "Past Papers", 
      desc: "පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ පිළිතුරු.", 
      icon: "📜", 
      gradient: "from-amber-500 via-orange-500 to-yellow-400",
      glowBg: "bg-amber-500/10 border-amber-200 dark:border-amber-900/60",
      link: "/pastpapers" 
    },
    { 
      title: "Daily Quiz", 
      desc: "දිනපතා කුඩා ප්‍රශ්න මාලා ඇසීමෙන් ඔබේ දැනුම පරික්ෂා කරන්න.", 
      icon: "🏆", 
      gradient: "from-rose-500 via-pink-500 to-red-400",
      glowBg: "bg-rose-500/10 border-rose-200 dark:border-rose-900/60",
      link: "/daily-challenge" 
    },
    { 
      title: "Auto Graph", 
      desc: "ගණිතමය දත්ත වලින් ග්‍රාෆ් සෑදීම හොඳින් කරගන්න.", 
      icon: "📈", 
      gradient: "from-cyan-500 via-blue-600 to-teal-400",
      glowBg: "bg-cyan-500/10 border-cyan-200 dark:border-cyan-900/60",
      link: "/grader" 
    },
  ];

  if (!isClient) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-[#eef2f9]'}`}></div>;
  }

  return (
    <main className={`min-h-screen pb-28 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#f0f4fb] text-slate-800'}`}>
      
      {/* --- Header with Curved Design & Custom Logo --- */}
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
            
            {/* Custom App Logo Badge */}
            <div className="relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden p-1.5 border border-white/20">
                <img 
                  src="/logo.png" 
                  alt="GanithaMithura Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/android-chrome-192x192.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Grid Menu Cards with Spacing --- */}
      <div className="p-5 grid grid-cols-2 gap-4.5 mt-4 relative z-20">
        {features.map((f, i) => (
          <Link 
            key={i} 
            href={f.link}
            className={`p-4.5 rounded-[28px] transition-all duration-300 flex flex-col justify-between relative border backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95 group overflow-hidden ${
              isDarkMode 
                ? 'bg-slate-900/90 border-slate-800/80 text-white hover:border-slate-700' 
                : 'bg-white/95 border-slate-200/80 text-slate-800 hover:border-blue-200'
            }`}
          >
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${f.gradient} opacity-5 group-hover:opacity-15 transition-opacity blur-xl`}></div>

            <div>
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl mb-3.5 shadow-md bg-gradient-to-br ${f.gradient} text-white transition-transform group-hover:scale-105`}>
                <span className="drop-shadow-sm">{f.icon}</span>
              </div>
              
              <h3 className="font-extrabold text-base mb-1 tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                {f.title}
              </h3>
              
              <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {f.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Sleek Floating Bottom Navigation --- */}
      <nav className={`fixed bottom-0 left-0 right-0 shadow-[0_-10px_35px_rgba(0,0,0,0.1)] rounded-t-[32px] px-6 py-3 flex justify-around items-center z-50 transition-colors duration-300 backdrop-blur-xl ${
        isDarkMode ? 'bg-slate-950/95 border-t border-slate-800/80' : 'bg-white/95 border-t border-slate-100'
      }`}>
        <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all group-hover:scale-105 flex items-center justify-center">
            <span className="text-base">🏠</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">Home</span>
        </Link>

        <Link href="/formulas" className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-all group">
          <div className="p-1.5 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <span className="text-xl">📖</span>
          </div>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Theory</span>
        </Link>

        <Link href="/grader" className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-all group">
          <div className="p-1.5 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <span className="text-xl">📊</span>
          </div>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Auto Graph</span>
        </Link>

        <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-all group">
          <div className="p-1.5 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <span className="text-xl">👤</span>
          </div>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Account</span>
        </Link>
      </nav>

    </main>
  );
}