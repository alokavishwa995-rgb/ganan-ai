'use client';

import { useState } from 'react';

// 1. TypeScript සඳහා Paper Type එක සාදා ගැනීම
type Paper = {
  year: string;
  title: string;
  paperUrl: string;
};

// 2015 සිට 2026 දක්වා Past Papers List එක
const pastPapersList: Paper[] = [
  { year: "2025", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2025-paper.pdf" },
  { year: "2024", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2024-paper.pdf" },
  { year: "2023", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2023-paper.pdf" },
  { year: "2022", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2022-paper.pdf" },
  { year: "2021", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2021-paper.pdf" },
  { year: "2020", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2020-paper.pdf" },
  { year: "2019", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2019-paper.pdf" },
  { year: "2018", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2018-paper.pdf" },
  { year: "2017", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2017-paper.pdf" },
  { year: "2016", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2016-paper.pdf" },
  { year: "2015", title: "අ.පො.ස (සා.පෙළ) ගණිතය", paperUrl: "/pdf/2015-paper.pdf" },
];

export default function PastPapersPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Selected paper state
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  const filteredPapers = pastPapersList.filter((paper) =>
    paper.year.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">පසුගිය විභාග ප්‍රශ්න පත්‍ර</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            2015 - 2026 දක්වා ප්‍රශ්න පත්‍ර මෙතැනින් බලන්න සහ බාගත කරගන්න.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="අවුරුද්ද සොයන්න (උදා: 2024)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
          />
        </div>

        {/* Grid */}
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPapers.map((paper) => (
              <div 
                key={paper.year} 
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
                      {paper.year} O/L
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Maths</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">{paper.title}</h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-700/50">
                  <button 
                    type="button"
                    onClick={() => setSelectedPaper(paper)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition"
                  >
                    <span>👁️</span> පේපර් එක බලන්න
                  </button>
                  <a 
                    href={paper.paperUrl} 
                    download={`${paper.year}-OL-Maths.pdf`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 transition"
                  >
                    <span>📥</span> PDF Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
            එවැනි වසරක් හමු නොවීය!
          </div>
        )}

      </div>

      {/* PDF Modal Viewer */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[85vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                {selectedPaper.year} O/L {selectedPaper.title}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={selectedPaper.paperUrl}
                  download={`${selectedPaper.year}-OL-Maths.pdf`}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
                >
                  📥 Download
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPaper(null)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative">
              <iframe
                src={selectedPaper.paperUrl}
                className="w-full h-full border-0"
                title={`${selectedPaper.year} Past Paper`}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}