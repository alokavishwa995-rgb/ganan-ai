"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FeatureCard from '@/components/FeatureCard';
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
    // Firebase auth වෙනුවට ආයෙත් localStorage පාවිච්චි කිරීම
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
      desc: "ඕනෑම පාඩමක් හෝ ප්‍රශ්නයක් AI සමඟ දිගටම සාකච්ඡා කරන්න", 
      icon: "🤖", 
      link: "/chaat" 
    },
    { 
      title: "Photo Scan", 
      desc: "ප්‍රශ්නයේ Photo එකක් ගෙන විසඳන්න", 
      icon: "📷", 
      link: "/scanner" 
    },
    { 
      title: "Theorems", 
      desc: "O/L අවශ්‍ය ප්‍රමේයන් සහ සූත්‍ර", 
      icon: "📐", 
      link: "/formulas" 
    },
    { 
      title: "Past Papers", 
      desc: "පසුගිය විභාග ප්‍රශ්න පත්‍ර", 
      icon: "📄", 
      link: "/pastpapers" 
    },
    { 
      title: "Paper Generator", 
      desc: "ඔබට අවශ්‍ය ප්‍රශ්න පත්‍ර පහසුවෙන් සාදාගන්න", 
      icon: "🖨️", 
      link: "/paper" 
    },
    { 
      title: "Auto Graph", 
      desc: "ඕනෑම සරල රේඛීය හෝ වර්ගජ සමීකරණයක් Type කළ සැනින් ඉබේම ප්‍රස්තාරය ඇඳේ!", 
      icon: "📊", 
      link: "/grader" 
    },
  ];

  // Hydration error එකක් නොඑන්න Load වෙනකම් හිස් තිරයක් පෙන්වීම
  if (!isClient) {
    return <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-[#f4f7fe]'}`}></div>;
  }

  return (
    <main className={`min-h-screen pb-28 font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f4f7fe] text-black'}`}>
      
      {/* --- Header --- */}
      <div className={`pt-12 pb-16 px-6 relative rounded-b-[30px] shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-[#151246]'}`}>
        <p className="text-gray-300 text-[14px] mb-1 font-medium">ආයුබෝවන්, {userName}!</p>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-extrabold text-white tracking-wide">ගණිත මිතුරා</h1>
            <p className="text-gray-400 text-sm mt-1">ඔබේ ගණිත ගමනේ හොඳම මිතුරා!</p>
          </div>
          
          <div className="flex gap-3 items-center">
            <button 
              onClick={toggleDarkMode}
              type="button"
              className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all shadow-lg"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
            </button>
            <NotificationDropdown userEmail={userEmail} />
          </div>
        </div>
      </div>

      {/* --- Grid Menu --- */}
      <div className="p-6 grid grid-cols-2 gap-4 -mt-6 relative z-10">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* --- Bottom Navigation --- */}
      <nav className={`fixed bottom-0 left-0 right-0 shadow-[0_-10px_40px_rgb(0,0,0,0.08)] rounded-t-[30px] px-8 py-5 flex justify-between items-center z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-t border-slate-800' : 'bg-white'}`}>
        <Link href="/" className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'} group-hover:scale-110 transition-transform`}>
            <span className="text-blue-600 text-[24px]">🏠</span>
          </div>
          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#151246]'}`}>Home</span>
        </Link>

        <Link href="/formulas" className="flex flex-col items-center gap-1 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[24px] grayscale group-hover:grayscale-0 transition-all">📖</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-[#151246]'}`}>Theory</span>
        </Link>

        <Link href="/grader" className="flex flex-col items-center gap-1 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[24px] grayscale group-hover:grayscale-0 transition-all">📊</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-[#151246]'}`}>Auto Graph</span>
        </Link>

        <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[24px] grayscale group-hover:grayscale-0 transition-all">👤</span>
          <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-[#151246]'}`}>Account</span>
        </Link>
      </nav>
      
    </main>
  );
}