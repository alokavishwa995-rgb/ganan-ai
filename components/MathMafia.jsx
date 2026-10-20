"use client"; // Next.js 13+ නම් මේක අනිවාර්යයි
import React, { useState } from 'react';
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; // ඔයාගේ Firebase config එක තියෙන තැන (වෙනස් කරගන්න)

export default function MathMafia({ userId = "test_user_123" }) {
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // 1. අලුත් නඩුවක් ගෙන ඒම
  const fetchNewCase = async () => {
    setIsLoading(true);
    setFeedback(null);
    setUserAnswer("");
    setSelectedSuspect(null);
    setCaseData(null);
    
    try {
      const res = await fetch('/api/generate-case', { method: 'POST' });
      const data = await res.json();
      if (data.success) setCaseData(data.caseData);
    } catch (error) {
      console.error("Case error:", error);
    }
    setIsLoading(false);
  };

  // 2. උත්තරය පරීක්ෂා කිරීම සහ Firebase එකට ලකුණු යැවීම
  const checkAnswer = async () => {
    if (!selectedSuspect) {
      setFeedback({ type: 'error', message: "කරුණාකර බොරු කියන සැකකාරයාව තෝරන්න!" });
      return;
    }
    if (!userAnswer) {
      setFeedback({ type: 'error', message: "කරුණාකර ඔබේ පිළිතුර ඇතුළත් කරන්න!" });
      return;
    }

    // ළමයා Type කරපු උත්තරේ JSON එකේ උත්තරේට සමානද බලනවා (Spaces අයින් කරලා)
    const isCorrect = userAnswer.trim() === caseData.mathClue.correctAnswer.trim();

    if (isCorrect) {
      setFeedback({ type: 'success', message: `නියමයි! ඔයා ${selectedSuspect.name}ව අල්ලගත්තා! ලකුණු +100` });
      
      // Firebase එකේ ලකුණු Update කිරීම
      try {
        const userRef = doc(db, "users", userId); 
        await updateDoc(userRef, {
          score: increment(100),
          solvedCases: increment(1)
        });
      } catch (error) {
        console.error("Firebase update failed:", error);
      }
    } else {
      setFeedback({ type: 'error', message: "වැරදියි! සැකකාරයා පැනලා යන්න කලින් ආයෙත් ගාණ හදලා බලන්න." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header & Button */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-red-500 tracking-wider">MATH MAFIA <span className="text-slate-500 text-lg">| O/L රහස් පරීක්ෂක</span></h1>
          <button 
            onClick={fetchNewCase} 
            disabled={isLoading}
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all disabled:opacity-50"
          >
            {isLoading ? "නඩුව සූදානම් කරමින්..." : "අලුත් නඩුවක් අරඹන්න"}
          </button>
        </div>

        {/* ගේම් එකේ ප්‍රධාන කොටස (නඩුව ලෝඩ් වුණාට පස්සේ පෙන්නනවා) */}
        {caseData && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* වම් පැත්ත: සැකකරුවන්ගේ ලැයිස්තුව */}
            <div className="md:col-span-5 bg-slate-900 rounded-lg p-5 border border-slate-800">
              <h2 className="text-xl font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                සැකකරුවන් (අත්අඩංගුවට ගත යුත්තේ කාවද?)
              </h2>
              <div className="space-y-4">
                {caseData.suspects.map((suspect) => (
                  <div 
                    key={suspect.id}
                    onClick={() => setSelectedSuspect(suspect)}
                    className={`p-4 rounded border-l-4 cursor-pointer transition-all ${
                      selectedSuspect?.id === suspect.id 
                      ? 'bg-slate-800 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                      : 'bg-slate-950 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-red-400 mb-1">{suspect.name}</div>
                    <div className="text-sm text-slate-400">"{suspect.statement}"</div>
                  </div>
                ))}
              </div>
            </div>

            {/* දකුණු පැත්ත: Evidence Board සහ ගැටළුව */}
            <div className="md:col-span-7">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl relative overflow-hidden">
                {/* Board Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-white mb-2 uppercase">{caseData.caseTitle}</h2>
                  
                  {/* Pinned Note 1: කතාව */}
                  <div className="bg-yellow-100/90 text-slate-900 p-4 rounded shadow-md transform -rotate-2 mb-6 max-w-lg mt-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 absolute -top-1.5 left-1/2 shadow-sm"></div>
                    <p className="font-medium text-sm leading-relaxed">{caseData.storyBackground}</p>
                  </div>

                  {/* Pinned Note 2: ගණිත ගැටළුව */}
                  <div className="bg-slate-100/95 text-slate-900 p-4 rounded shadow-md transform rotate-1 max-w-lg mb-8">
                    <div className="w-3 h-3 rounded-full bg-blue-500 absolute -top-1.5 left-4 shadow-sm"></div>
                    <h3 className="font-bold text-red-700 mb-2 text-sm border-b border-slate-300 pb-1">රහස් පරීක්ෂක කාර්යය:</h3>
                    <p className="font-semibold text-base">{caseData.mathClue.question}</p>
                  </div>

                  {/* පිළිතුරු සපයන කොටස */}
                  <div className="bg-slate-900 p-4 rounded border border-slate-700 mt-8">
                    <label className="block text-sm font-bold text-slate-400 mb-2">ඔබේ ගණනය කිරීම්වල අවසන් පිළිතුර මෙහි යොදන්න:</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="පිළිතුර ටයිප් කරන්න..." 
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                      <button 
                        onClick={checkAnswer}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                      >
                        නඩුව විසඳන්න
                      </button>
                    </div>
                  </div>

                  {/* Feedback Modal / Alert */}
                  {feedback && (
                    <div className={`mt-4 p-4 rounded font-bold ${feedback.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-red-900/50 text-red-400 border border-red-700'}`}>
                      {feedback.message}
                      {feedback.type === 'success' && (
                        <div className="mt-2 text-sm font-normal text-slate-300">
                          <strong>විසඳුම:</strong> {caseData.mathClue.explanation}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}