import React from "react";
import { Metadata } from "next";
import { theoremsData } from "../data/theorems"; // 👈 Relative Path වෙනුවට Path Alias (@/)
import { TheoremCard } from "../../components/TheoremCard";

// 🎯 Browser Tab Title & SEO සඳහා
export const metadata: Metadata = {
  title: "ජ්‍යාමිතිය ප්‍රමේයයන් | ගණිත මිතුරා",
  description: "අ.පො.ස සාමාන්‍ය පෙළ ගණිතය ජ්‍යාමිතිය ප්‍රමේයයන් සහ සිද්ධාන්ත එකතුව.",
};

export default function TheoremsPage() {
  return (
    // පසුබිම සහ පිටුවේ padding (Dark Mode support සමඟ)
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 px-3 xs:px-4 sm:p-6 pb-20">
      
      {/* Container - Max Width 1320px */}
      <div className="max-w-[1320px] mx-auto w-full">
        
        {/* App Title Section */}
        <div className="mb-8 sm:mb-12 text-center mt-4 sm:mt-8 select-none">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
            ජ්‍යාමිතිය
          </h1>
          <p className="text-blue-600 dark:text-blue-400 font-extrabold tracking-[0.15em] text-[10px] sm:text-xs uppercase">
            ප්‍රමේයයන් සහ සිද්ධාන්ත
          </p>
          <div className="h-1 sm:h-1.5 w-12 sm:w-16 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mt-3 sm:mt-4 shadow-sm"></div>
        </div>

        {/* --- Grid Section --- */}
        {theoremsData && theoremsData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 w-full justify-items-center">
            {theoremsData.map((th) => (
              <TheoremCard key={th.id} theorem={th} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium">
            ප්‍රමේයයන් දත්ත හමු නොවීය. 🔍
          </div>
        )}
        
      </div>
    </div>
  );
}