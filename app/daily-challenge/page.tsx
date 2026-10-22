"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Question {
  id: number;
  category?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  svgDiagram?: string; // 🎯 SVG Diagram පහසුකම
}

interface LeaderboardEntry {
  name: string;
  email: string;
  score: number;
  timeSpent: number;
}

export default function DailyChallengePage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("මිතුරා");
  const [isClient, setIsClient] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  
  const [timeLeft, setTimeLeft] = useState(600); // විනාඩි 10යි (තත්පර 600)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // 🎯 KaTeX Math සූත්‍ර ඇතුළතින් \u200D Zero-Width Joiner ඉවත් කිරීම
  const cleanMathText = (text: string) => {
    if (!text) return "";
    return text.replace(/(\$\$[\s\S]*?\$\$|\$[^\$]+\$)/g, (match) =>
      match.replace(/\u200D/g, "")
    );
  };

  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (!email) {
      router.push("/");
      return;
    }
    setUserEmail(email.toLowerCase());
    if (name) setUserName(name);

    // අද දවසේ ප්‍රශ්න 10 ගෙන ඒම
    fetch("/api/daily-challenge")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.challenge)) {
          setQuestions(data.challenge);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load challenge", err);
        setLoading(false);
      });
  }, [router]);

  // Timer එක (විනාඩි 10)
  useEffect(() => {
    if (!examStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, isSubmitted]);

  const handleOptionSelect = (qId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const timeSpent = 600 - timeLeft; // ගතවූ කාලය

    try {
      const res = await fetch("/api/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userName, userAnswers: answers, timeSpent })
      });
      const data = await res.json();
      if (data.success) {
        setFinalScore(data.score);
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!isClient) return <div className="min-h-screen bg-slate-50"></div>;

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 font-sans">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex justify-between items-center">
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:opacity-80 transition">
          <span>🔙</span> මුල් පිටුවට
        </Link>
        <div className="text-right">
          <h1 className="text-lg font-extrabold text-slate-800">දවසේ අභියෝගය 🏆</h1>
          <p className="text-xs text-slate-500">O/L ගණිත ප්‍රශ්න 10ක් - විනාඩි 10ක්</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="bg-white p-10 rounded-3xl shadow-sm text-center animate-pulse">
            <div className="text-4xl mb-4">⌛</div>
            <p className="text-indigo-600 font-bold">අද දවසේ O/L අභියෝගය සූදානම් වෙමින් පවතී...</p>
          </div>
        ) : !examStarted && !isSubmitted ? (
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex justify-center items-center text-4xl mx-auto mb-4">
              ⚔️
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ඔබ අභියෝගයට සූදානම්ද?</h2>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              අද දවස සඳහා O/L ගණිතය 1 වන ප්‍රශ්න පත්‍රයේ ආකෘතියට සකස් කළ කෙටි ප්‍රශ්න 10ක් මෙහි ඇත. ඔබ ලබාගන්නා ලකුණු සහ ගතවන කාලය අනුව ඔබේ ස්ථානය Leaderboard එකේ පෙන්වනු ඇත.
            </p>
            <button
              onClick={() => setExamStarted(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              අභියෝගය අරඹන්න 🚀
            </button>
          </div>
        ) : examStarted && !isSubmitted ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                  ප්‍රශ්නය {currentQIndex + 1} / 10
                </span>
                {currentQ?.category && (
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-medium hidden sm:inline-block">
                    {currentQ.category}
                  </span>
                )}
              </div>

              <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            <div className="mb-8">
              {/* ප්‍රශ්නය Render කිරීම (KaTeX Support) */}
              <div className="text-lg font-bold text-slate-800 mb-6 leading-relaxed prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {cleanMathText(currentQ?.question || "")}
                </ReactMarkdown>
              </div>

              {/* 🎯 SVG Diagram එකක් තිබේ නම් පෙන්වීම */}
              {currentQ?.svgDiagram && (
                <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex justify-center items-center shadow-inner overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: currentQ.svgDiagram }} />
                </div>
              )}

              {/* Options 4 ක් */}
              <div className="space-y-3">
                {currentQ?.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                      answers[currentQ.id] === opt 
                        ? 'border-indigo-500 bg-indigo-50/50' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQ.id}`}
                      value={opt}
                      checked={answers[currentQ.id] === opt}
                      onChange={() => handleOptionSelect(currentQ.id, opt)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div className="text-slate-700 font-medium text-sm sm:text-base prose prose-slate max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {cleanMathText(opt)}
                      </ReactMarkdown>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-6 py-2.5 rounded-xl text-slate-600 bg-slate-100 font-bold disabled:opacity-50 hover:bg-slate-200 transition"
              >
                ⬅️ පෙර
              </button>

              {currentQIndex === 9 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl text-white bg-green-600 hover:bg-green-700 font-bold shadow-md transition"
                >
                  පිළිතුරු භාරදෙන්න ✔️
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQIndex(prev => Math.min(9, prev + 1))}
                  className="px-6 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md transition"
                >
                  ඊළඟ ➡️
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-lg text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🎯</div>
              <h2 className="text-2xl font-bold mb-2">අභියෝගය අවසන්!</h2>
              <p className="text-indigo-100 mb-6">ඔබේ අද දවසේ ප්‍රතිඵලය</p>
              
              <div className="flex justify-center items-end gap-2 mb-2">
                <span className="text-6xl font-black">{finalScore}</span>
                <span className="text-2xl font-medium opacity-80 mb-1">/ 100</span>
              </div>
              <p className="text-sm bg-white/20 inline-block px-4 py-1.5 rounded-full mt-2">
                ගතවූ කාලය: {formatTime(600 - timeLeft)}
              </p>
            </div>

            {/* Leaderboard */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🏆</span> අද දවසේ හොඳම 10 දෙනා
              </h3>
              
              <div className="space-y-3">
                {leaderboard.length > 0 ? leaderboard.map((player, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${player.email === userEmail ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {idx + 1}
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{player.name} {player.email === userEmail && "(ඔබ)"}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-indigo-600">{player.score} pts</div>
                      <div className="text-[10px] text-slate-400">{formatTime(player.timeSpent)}</div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-slate-500 text-sm">දත්ත සකසමින් පවතී...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}