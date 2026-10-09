import React from 'react';
import { TheoremDiagram } from './TheoremDiagram';

export const TheoremCard = ({ theorem }: { theorem: any }) => {
  if (!theorem) return null;

  // 180° වල පාට වෙනස් කරන Helper Function එක (කිසිදු වෙනසක් කර නැත)
  const formatMathLine = (line: string) => {
    if (line.includes('180°')) {
      const [before, after] = line.split('180°');
      return (
        <>
          {before}
          <span className="text-[#2b3ca6]">180</span>
          <span className="text-[#b83232]">°</span>
          {after}
        </>
      );
    }
    return line;
  };

  return (
    <div className="w-full max-w-[620px] mx-auto p-2 sm:p-4 select-none perspective-1000">
      {/* Main Card Container: 
        Mouse එක ගෙනියද්දී උස් පහත් වෙන (Lift effect) එක සහ Shadow එක මෙතනට දාලා තියෙන්නේ. 
      */}
      <div className="relative bg-gradient-to-b from-[#ffffff] to-[#fafafa] rounded-[18px] sm:rounded-[24px] 
                      shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-gray-200/60 
                      overflow-hidden group cursor-default h-auto min-h-[260px] xs:min-h-[320px] sm:min-h-[392px] w-full flex flex-col justify-between
                      transition-all duration-400 ease-out hover:-translate-y-2.5 hover:shadow-[0_20px_40px_rgba(29,94,200,0.12)] hover:border-[#3a8ef6]/40">
        
        {/* Background Decorative Waves (Hover වෙද්දී සියුම්ව Scale වෙනවා) */}
        <div className="absolute inset-0 opacity-[0.55] pointer-events-none transition-transform duration-700 group-hover:scale-105">
          <svg className="w-full h-auto" viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50,320 C100,360 150,220 300,280 C450,340 500,240 650,290" stroke="#051836" strokeWidth="0.6" opacity="0.25"/>
            <path d="M-50,330 C120,340 130,250 280,290 C430,330 520,220 650,270" stroke="#c57d00" strokeWidth="0.5" opacity="0.25"/>
            <path d="M400,-50 C450,50 520,80 550,180 C580,280 620,300 650,350" stroke="#132441" strokeWidth="0.4" opacity="0.15"/>
          </svg>
        </div>

        <div className="relative z-10 p-4 xs:p-5 sm:p-7 flex flex-col justify-between h-full w-full flex-grow">
          <div>
            {/* 1. Blue Header Badge */}
            <div className="mb-3 sm:mb-5">
              <div className="inline-block bg-gradient-to-b from-[#3a8ef6] to-[#1d5ec8] 
                              px-5 sm:px-8 py-1 sm:py-2 rounded-[8px] sm:rounded-[12px] 
                              shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_4px_10px_rgba(29,94,200,0.25)] 
                              border border-[#1d5ec8]/50 transition-transform duration-300 group-hover:scale-[1.02]">
                <h2 className="text-white text-[13px] xs:text-[15px] sm:text-[23px] font-extrabold tracking-wide drop-shadow-sm">
                  {theorem.title || "ප්‍රමේයය"}
                </h2>
              </div>
            </div>

            {/* 2. Theorem Statement */}
            <div className="mb-3 sm:mb-5 px-1">
              <p className="text-[#1a1a1a] text-[12px] min-[380px]:text-[13.5px] min-[450px]:text-[15.5px] sm:text-[22px] font-bold leading-[1.6] sm:leading-[1.7] text-justify drop-shadow-sm">
                {theorem.statement}
              </p>
            </div>
          </div>

          {/* 3. Horizontal Divider (Hover වෙද්දී පාට ටිකක් Highlight වෙනවා) */}
          <div className="w-full mb-3 sm:mb-5 flex justify-center">
            <div className="h-[1px] sm:h-[1.5px] w-[95%] bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-[#3a8ef6]/50 transition-colors duration-500"></div>
          </div>

          {/* 4. Content Section */}
          <div className="flex flex-row items-center justify-between gap-3 sm:gap-8 flex-grow pb-2 sm:pb-4 px-1 sm:px-2">
            
            {/* Left: Diagram Wrapper */}
            <div className="w-[45%] flex justify-center items-center flex-shrink-0 relative">
              {/* Diagram එක පිටුපසින් එන සියුම් Glow එක (Smart Look එකක් දෙයි) */}
              <div className="absolute inset-0 bg-blue-100/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-full relative z-10 transform transition-transform duration-500 ease-out group-hover:scale-[1.05]">
                <TheoremDiagram id={theorem.id} />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[2px] h-[85%] min-h-[90px] bg-gradient-to-b from-[#2563eb] via-[#4d2b75] to-[#7a1b29] opacity-70 group-hover:opacity-100 transition-opacity duration-500 rounded-full flex-shrink-0"></div>

            {/* Right: Math Equations (දත්ත පිළිවෙළකට සහ කියවන්න පහසු වෙන්න හදලා තියෙනවා) */}
            <div className="w-[50%] flex flex-col justify-center space-y-1.5 xs:space-y-2 sm:space-y-4 pl-2 sm:pl-5 flex-shrink-0">
              {theorem.mathLines?.map((line: string, i: number) => {
                const isHeadingLine = line.includes('BD̂') || line.includes('AOC');
                return (
                  <div key={i} className="flex items-center group/line">
                    {/* Hover වෙද්දී විතරක් පේන පොඩි Bullet point එකක් (පිළිවෙළකට පේන්න) */}
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500/40 mr-2 sm:mr-3 opacity-0 group-hover/line:opacity-100 transition-opacity duration-300"></div>
                    <p 
                      className={`text-[11px] min-[380px]:text-[12.5px] min-[450px]:text-[14.5px] sm:text-[22px] 
                                  font-bold text-gray-800 tracking-wide whitespace-normal leading-relaxed
                                  transition-transform duration-300 group-hover/line:translate-x-1
                                  ${isHeadingLine ? 'font-serif non-italic text-[#1a1a1a]' : 'italic text-gray-700'}`}
                    >
                      {formatMathLine(line)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* 5. Footer */}
        <div className="bg-gradient-to-b from-gray-50/80 to-gray-100 text-center border-t border-gray-200/50 w-full z-10 flex-shrink-0 py-1.5 sm:py-2.5">
          <span className="text-[7px] xs:text-[9px] sm:text-[12px] text-gray-400 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">
             {/* හිස්ව තැබීමට දුන් උපදෙස පරිදිම තබා ඇත */}
          </span>
        </div>
      </div>
    </div>
  );
};