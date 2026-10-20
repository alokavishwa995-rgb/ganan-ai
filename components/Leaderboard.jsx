"use client";
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard() {
  const [topDetectives, setTopDetectives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // ලකුණු (score) අනුව වැඩිම කෙනාගේ ඉඳන් 10 දෙනෙක් ඉල්ලනවා
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        const detectivesList = [];
        querySnapshot.forEach((doc) => {
          detectivesList.push({ id: doc.id, ...doc.data() });
        });
        
        setTopDetectives(detectivesList);
      } catch (error) {
        console.error("Leaderboard load error:", error);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-slate-400 text-center p-4">Loading Leaderboard...</div>;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 max-w-md mx-auto text-white shadow-lg">
      <h2 className="text-xl text-yellow-500 font-black mb-4 text-center tracking-wide">🏆 TOP DETECTIVES</h2>
      
      <ul className="space-y-2">
        {topDetectives.map((detective, index) => (
          <li key={detective.id} className="flex justify-between items-center bg-slate-950/50 p-3 rounded border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-lg w-6 text-center">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : <span className="text-slate-500 text-sm font-bold">#{index + 1}</span>}
              </span>
              <span className="font-semibold text-slate-200">{detective.displayName || "Unknown Detective"}</span>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">{detective.score || 0} Pts</div>
              <div className="text-xs text-slate-500">නඩු {detective.solvedCases || 0}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}