import React from 'react';

export const TheoremDiagram = ({ id }: { id: number }) => {
  const lineStroke = "#262626"; // තද අළු/කළු රේඛා
  const labelColor = "#7a1b29"; // ලේබල් සඳහා තද මරූන් පාට
  const fontStyle = "Times New Roman, Georgia, serif";

  // 1. බද්ධ කෝණ ප්‍රමේයය (දැනටමත් නිවැරදිව වැඩ කරයි)
  if (id === 1) {
    return (
      <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 72 L 36 72 A 24 24 0 0 1 76.5 54.5 Z" fill="#e4b620" /> 
        <path d="M 60 72 L 76.5 54.5 A 24 24 0 0 1 84 72 Z" fill="#4d2b75" /> 
        <line x1="12" y1="72" x2="108" y2="72" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="60" y1="72" x2="98" y2="28" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        <text x="7" y="86" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
        <text x="54" y="86" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
        <text x="103" y="86" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>
        <text x="100" y="24" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>D</text>
        <text x="46" y="67" fontSize="10" fill="#2d1609" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>a</text>
        <text x="70" y="68" fontSize="10" fill="#ffffff" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>b</text>
      </svg>
    );
  }
  
  // 2. ප්‍රතිමුඛ කෝණ ප්‍රමේයය (දැනටමත් නිවැරදිව වැඩ කරයි)
  if (id === 2) {
    return (
      <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 45 L 39 30 A 25 25 0 0 1 81 30 Z" fill="#fceb01" opacity="0.9" />
        <path d="M 60 45 L 81 30 A 25 25 0 0 1 81 60 Z" fill="#4d2b75" opacity="0.9" />
        <path d="M 60 45 L 81 60 A 25 25 0 0 1 39 60 Z" fill="#fceb01" opacity="0.9" />
        <path d="M 60 45 L 39 60 A 25 25 0 0 1 39 30 Z" fill="#4d2b75" opacity="0.9" />
        <line x1="15" y1="13" x2="105" y2="77" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="15" y1="77" x2="105" y2="13" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="60" cy="45" r="2" fill={lineStroke} />
        <text x="10" y="20" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
        <text x="100" y="84" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
        <text x="100" y="20" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>
        <text x="10" y="84" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>D</text>
        <text x="56" y="56" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>O</text>
        <text x="57" y="32" fontSize="9" fontWeight="bold" fontStyle="italic" fill="#2d1609">a</text>
        <text x="43" y="48" fontSize="9" fontWeight="bold" fontStyle="italic" fill="#ffffff">b</text>
        <text x="57" y="65" fontSize="9" fontWeight="bold" fontStyle="italic" fill="#2d1609">c</text>
        <text x="71" y="48" fontSize="9" fontWeight="bold" fontStyle="italic" fill="#ffffff">d</text>
      </svg>
    );
  }

// 3. මිත්‍ර/ඒකාන්තර/අනුරූප කෝණ ප්‍රමේයය
 // 3. මිත්‍ර/ඒකාන්තර/අනුරූප කෝණ ප්‍රමේයය (පොතේ රූපය 3 සහ 4 සඳහාම ගැළපේ)
  if (id === 3) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* --- ඉහළ කෝණ හතර (Center: 75, 40) --- */}
        {/* කෝණය a - කහ */}
        <path d="M 75 40 L 63 38.9 A 12 12 0 0 1 80.4 29.3 Z" fill="#facc15" />
        {/* කෝණය b - දම් */}
        <path d="M 75 40 L 80.4 29.3 A 12 12 0 0 1 87 41.1 Z" fill="#d946ef" />
        {/* කෝණය c - කහ */}
        <path d="M 75 40 L 87 41.1 A 12 12 0 0 1 69.6 50.7 Z" fill="#facc15" />
        {/* කෝණය d - දම් */}
        <path d="M 75 40 L 69.6 50.7 A 12 12 0 0 1 63 38.9 Z" fill="#d946ef" />

        {/* --- පහළ කෝණ හතර (Center: 55, 80) --- */}
        {/* කෝණය e - කහ */}
        <path d="M 55 80 L 43 80 A 12 12 0 0 1 60.4 69.3 Z" fill="#facc15" />
        {/* කෝණය f - දම් */}
        <path d="M 55 80 L 60.4 69.3 A 12 12 0 0 1 67 80 Z" fill="#d946ef" />
        {/* කෝණය g - කහ */}
        <path d="M 55 80 L 67 80 A 12 12 0 0 1 49.6 90.7 Z" fill="#facc15" />
        {/* කෝණය h - දම් */}
        <path d="M 55 80 L 49.6 90.7 A 12 12 0 0 1 43 80 Z" fill="#d946ef" />

        {/* --- ජ්‍යාමිතික රේඛා 3 (Lines) --- */}
        {/* AB රේඛාව (පොතේ පරිදි සුළු ඇලවීමක් සහිතයි) */}
        <line x1="20" y1="35" x2="130" y2="45" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* CD රේඛාව (තිරස්ව ඇත) */}
        <line x1="20" y1="80" x2="130" y2="80" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* EF හරස් රේඛාව (Transversal) */}
        <line x1="85" y1="20" x2="45" y2="100" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />

        {/* --- රේඛා ලේබල (A, B, C, D, E, F) --- */}
        <text x="10" y="35" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
        <text x="134" y="48" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
        <text x="10" y="84" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>
        <text x="134" y="84" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>D</text>
        <text x="88" y="15" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>E</text>
        <text x="40" y="112" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>F</text>

        {/* --- කෝණ අකුරු 8 (a, b, c, d, e, f, g, h) --- */}
        {/* ඉහළ ඡේදනය වන ස්ථානයේ කෝණ */}
        <text x="67" y="28" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">a</text>
        <text x="83" y="32" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">b</text>
        <text x="81" y="52" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">c</text>
        <text x="65" y="48" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">d</text>
        
        {/* පහළ ඡේදනය වන ස්ථානයේ කෝණ */}
        <text x="47" y="68" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">e</text>
        <text x="63" y="72" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">f</text>
        <text x="61" y="92" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">g</text>
        <text x="45" y="88" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">h</text>
      </svg>
    );
  }
  // 4. සමාන්තර රේඛා සහ හරස් රේඛා ප්‍රමේයය
  if (id === 4) {
    return (
      <svg viewBox="0 0 160 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* --- ඉහළ කෝණ හතර (Center: 85, 40) --- */}
        {/* කෝණය a - කහ */}
        <path d="M 85 40 L 71.0 40.0 A 14 14 0 0 1 91.3 27.5 Z" fill="#facc15" />
        {/* කෝණය b - දම්/මැජෙන්ටා */}
        <path d="M 85 40 L 91.3 27.5 A 14 14 0 0 1 99.0 40.0 Z" fill="#d946ef" />
        {/* කෝණය c - තැඹිලි */}
        <path d="M 85 40 L 99.0 40.0 A 14 14 0 0 1 78.7 52.5 Z" fill="#f97316" />
        {/* කෝණය d - නිල් */}
        <path d="M 85 40 L 78.7 52.5 A 14 14 0 0 1 71.0 40.0 Z" fill="#3b82f6" />

        {/* ---  පහළ කෝණ හතර (Center: 60, 85) --- */}
        {/* කෝණය e - කහ */}
        <path d="M 60 85 L 46.0 85.0 A 14 14 0 0 1 66.3 72.5 Z" fill="#facc15" />
        {/* කෝණය f - දම්/මැජෙන්ටා */}
        <path d="M 60 85 L 66.3 72.5 A 14 14 0 0 1 74.0 85.0 Z" fill="#d946ef" />
        {/* කෝණය g - තැඹිලි */}
        <path d="M 60 85 L 74.0 85.0 A 14 14 0 0 1 53.7 97.5 Z" fill="#f97316" />
        {/* කෝණය h - නිල් */}
        <path d="M 60 85 L 53.7 97.5 A 14 14 0 0 1 46.0 85.0 Z" fill="#3b82f6" />

        {/* --- ජ්‍යාමිතික රේඛා 3 (Lines) --- */}
        {/* AB රේඛාව (පර්ෆෙක්ට් තිරස් සමාන්තර රේඛාව) */}
        <line x1="25" y1="40" x2="135" y2="40" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* CD රේඛාව (පර්ෆෙක්ට් තිරස් සමාන්තර රේඛාව) */}
        <line x1="25" y1="85" x2="135" y2="85" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* EF හරස් රේඛාව (Transversal) */}
        <line x1="99" y1="15" x2="46" y2="110" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" />

        {/* --- සමාන්තර රේඛා සඳහා වන හරිත ඊතල (Green Parallel Line Arrowheads) --- */}
        <path d="M 111 35 L 116 40 L 111 45" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 111 80 L 116 85 L 111 90" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- රේඛා ලේබල (A, B, C, D, E, F) --- */}
        <text x="12" y="44" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
        <text x="140" y="44" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
        <text x="12" y="89" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>
        <text x="140" y="89" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>D</text>
        <text x="96" y="12" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>E</text>
        <text x="42" y="123" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>F</text>

        {/* --- කෝණ අකුරු 8 (a, b, c, d, e, f, g, h) --- */}
        {/* ඉහළ කෝණ */}
        <text x="73" y="32" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">a</text>
        <text x="93" y="33" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">b</text>
        <text x="89" y="52" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">c</text>
        <text x="71" y="49" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">d</text>
        
        {/* පහළ කෝණ */}
        <text x="48" y="77" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">e</text>
        <text x="68" y="78" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">f</text>
        <text x="64" y="97" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">g</text>
        <text x="46" y="94" fontSize="10" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#1e293b">h</text>
      </svg>
    );
  }
  // 5. පා.කෝ.පා. ප්‍රමේයය (ත්‍රිකෝණ ආංගසමතාව)
  if (id === 5) {
    return (
      <svg viewBox="0 0 250 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* --- පළමු ත්‍රිකෝණය (ABC) --- */}
        {/* B කෝණයේ Magenta වර්ණය */}
        <path d="M 25 110 L 37 110 A 15 15 0 0 0 32.7 96.6 Z" fill="#d946ef" />
        
        {/* ABC ත්‍රිකෝණයේ රේඛා */}
        <polygon points="55,45 25,110 115,110" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* AB පාදයේ ද්විත්ව ඉර සලකුණ (Double Ticks) */}
        <line x1="40" y1="70" x2="46" y2="73" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="37" y1="77" x2="43"y2="79" stroke={lineStroke} strokeWidth="1.5" />
        {/* BC පාදයේ තනි ඉර සලකුණ (Single Tick) */}
        <line x1="70" y1="106" x2="70" y2="114" stroke={lineStroke} strokeWidth="1.5" />

        {/* ABC ලේබල් */}
        <text x="51" y="40" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">A</text>
        <text x="14" y="115" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">B</text>
        <text x="118" y="115" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">C</text>


        {/* --- දෙවැනි ත්‍රිකෝණය (RPQ - හැරවුණු ත්‍රිකෝණය) --- */}
        {/* Q කෝණයේ Magenta වර්ණය */}
        <path d="M 215 45 L 202 45 A 15 15 0 0 1 207.3 58.4 Z" fill="#d946ef" />
        
        {/* RPQ ත්‍රිකෝණයේ රේඛා */}
        <polygon points="125,45 215,45 185,110" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* RQ පාදයේ තනි ඉර සලකුණ (Single Tick) */}
        <line x1="170" y1="41" x2="170" y2="49" stroke={lineStroke} strokeWidth="1.5" />
        {/* QP පාදයේ ද්විත්ව ඉර සලකුණ (Double Ticks) */}
        <line x1="197" y1="79" x2="203" y2="76" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="199" y1="82" x2="205" y2="79" stroke={lineStroke} strokeWidth="1.5" />

        {/* RPQ ලේබල් */}
        <text x="114" y="44" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">R</text>
        <text x="218" y="44" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">Q</text>
        <text x="181" y="122" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">P</text>
      </svg>
    );
  }
  // 5. කෝ.කෝ.පා. ප්‍රමේයය (ත්‍රිකෝණ ආංගසමතාව - කෝණ-කෝණ-පාදය)
  if (id === 6) {
    return (
      <svg viewBox="0 0 250 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* --- පළමු ත්‍රිකෝණය (KLM) --- */}
        {/* KLM ත්‍රිකෝණයේ රේඛා (නිල් පාට බෝඩර්) */}
        <polygon points="55,30 25,100 115,100" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* K කෝණයේ කහ වර්ණ ARC සලකුණ */}
        <path d="M 25 100 L 37 100 A 15 15 0 0 0 32.7 86.6 Z" fill="#facc15" stroke="#facc15" strokeWidth="0.5" />
        {/* M කෝණයේ දම් වර්ණ ARC සලකුණ */}
        <path d="M 55 30 L 48.7 44.7 A 16 16 0 0 1 61.3 44.7 Z" fill="#d946ef" stroke="#d946ef" strokeWidth="0.5" />

        {/* KM පාදයේ ද්විත්ව ඉರ සලකුණ (Double Ticks) */}
        <line x1="37" y1="64" x2="43" y2="61" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="39" y1="67" x2="45" y2="64" stroke={lineStroke} strokeWidth="1.5" />

        {/* KLM ලේබල් (රතු පාට) */}
        <text x="51" y="25" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">M</text>
        <text x="14" y="105" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">K</text>
        <text x="118" y="105" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">L</text>


        {/* --- දෙවැනි ත්‍රිකෝණය (XYZ) --- */}
        {/* XYZ ත්‍රිකෝණයේ රේඛා (නිල් පාට බෝඩර්) */}
        <polygon points="135,30 215,45 165,120" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Z කෝණයේ කහ වර්ණ ARC සලකුණ */}
        <path d="M 135 30 L 148 30 A 13 13 0 0 1 142.3 43.1 Z" fill="#facc15" stroke="#facc15" strokeWidth="0.5" />
        {/* Y කෝණයේ දම් වර්ණ ARC සලකුණ */}
        <path d="M 215 45 L 202.5 42.6 A 13 13 0 0 1 208.5 56.5 Z" fill="#d946ef" stroke="#d946ef" strokeWidth="0.5" />

        {/* ZY පාදයේ ද්විත්ව ඉර සලකුණ (Double Ticks) */}
        <line x1="171" y1="34" x2="173" y2="41" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="174" y1="33" x2="176" y2="40" stroke={lineStroke} strokeWidth="1.5" />

        {/* XYZ ලේබල් (රතු පාට) */}
        <text x="122" y="32" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">Z</text>
        <text x="220" y="48" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">Y</text>
        <text x="161" y="132" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">X</text>
      </svg>
    );
  }
  // 7. පා.පා.පා. ප්‍රමේයය (ත්‍රිකෝණ ආංගසමතාව - පාදය-පාදය-පාදය)
  if (id === 7) {
    return (
      <svg viewBox="0 0 250 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* --- පළමු ත්‍රිකෝණය (ABC) --- */}
        {/* ABC ත්‍රිකෝණයේ රේඛා (නිල් පාට ბෝඩර්) */}
        <polygon points="50,40 15,110 115,110" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* AB පාදයේ තනි ඉර සලකුණ (Single Tick) */}
        <line x1="65" y1="106" x2="65" y2="114" stroke={lineStroke} strokeWidth="1.5" />
        
        {/* BC පාදයේ ද්විත්ව ඉර සලකුණ (Double Ticks) */}
        <line x1="80" y1="72" x2="86" y2="77" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="83" y1="69" x2="89" y2="74" stroke={lineStroke} strokeWidth="1.5" />
        
        {/* AC පාදයේ ත්‍රිත්ව ඉර සලකුණ (Triple Ticks) */}
        <line x1="30" y1="72" x2="36" y2="70" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="32" y1="75" x2="38" y2="73" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="34" y1="78" x2="40" y2="76" stroke={lineStroke} strokeWidth="1.5" />

        {/* ABC ලේබල් (රතු පාට) */}
        <text x="46" y="34" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">C</text>
        <text x="5" y="115" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">A</text>
        <text x="118" y="115" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">B</text>


        {/* --- දෙවැනි ත්‍රිකෝණය (DEF - ඇලවුණු ත්‍රිකෝණය) --- */}
        {/* DEF ත්‍රිකෝණයේ රේඛා (නිල් පාට බෝඩර්) */}
        <polygon points="205,30 135,90 225,105" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
        
        {/* DE පාදයේ තනි ඉර සලකුණ (Single Tick) */}
        <line x1="178" y1="94" x2="181" y2="102" stroke={lineStroke} strokeWidth="1.5" />
        
        {/* DF පාදයේ ද්විත්ව ඉර සලකුණ (Double Ticks) */}
        <line x1="167" y1="57" x2="173" y2="62" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="170" y1="54" x2="176" y2="59" stroke={lineStroke} strokeWidth="1.5" />
        
        {/* FE පාදයේ ත්‍රිත්ව ඉර සලකුණ (Triple Ticks) */}
        <line x1="212" y1="65" x2="220" y2="67" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="213" y1="61" x2="221" y2="63" stroke={lineStroke} strokeWidth="1.5" />
        <line x1="214" y1="57" x2="222" y2="59" stroke={lineStroke} strokeWidth="1.5" />

        {/* DEF ලේබල් (රතු පාට) */}
        <text x="207" y="25" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">F</text>
        <text x="122" y="94" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">D</text>
        <text x="228" y="112" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">E</text>
      </svg>
    );
  }
// 8. කර්ණ-පාද ප්‍රමේයය (RHS Theorem) - Q කෝණය නිවැරදි කරන ලද සංස්කරණය
if (id === 8) {
  return (
    <svg viewBox="0 0 340 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* ---------------- ABC ත්‍රිකෝණය ---------------- */}
      {/* C කෝණයේ සෘජුකෝණ සලකුණ */}
      <rect x="52" y="32" width="14" height="14" fill="#e4b620" />
      <path d="M 52 46 L 66 46 L 66 32" fill="none" stroke="#d91b5c" strokeWidth="2" />

      {/* ABC බාහු */}
      <line x1="52" y1="32" x2="152" y2="32" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="32" x2="52" y2="152" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="152" x2="152" y2="32" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />

      {/* CB බාහුවේ සමාන ලකුණු දෙක (Double Tick) */}
      <line x1="97" y1="26" x2="97" y2="38" stroke="#d91b5c" strokeWidth="2" />
      <line x1="103" y1="26" x2="103" y2="38" stroke="#d91b5c" strokeWidth="2" />

      {/* AB කර්ණයේ තනි සමාන ලකුණ (Single Tick) */}
      <line x1="98" y1="88" x2="106" y2="96" stroke="#d91b5c" strokeWidth="2" />

      {/* ABC අකුරු (Labels) */}
      <text x="44" y="166" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>A</text>
      <text x="158" y="36" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>B</text>
      <text x="40" y="30" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>C</text>


      {/* ---------------- PQR ත්‍රිකෝණය ---------------- */}
      {/* Q කෝණයේ සෘජුකෝණ සලකුණ (ත්‍රිකෝණය ඇතුළතට පමණක් වන්නට නිවැරදි කර ඇත) */}
      <g transform="translate(216,134) rotate(149)">
        <rect x="0" y="0" width="14" height="14" fill="#e4b620" />
        <path d="M 0 14 L 14 14 L 14 0" fill="none" stroke="#d91b5c" strokeWidth="2" />
      </g>

      {/* PQR බාහු */}
      <line x1="136" y1="92" x2="216" y2="134" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="216" y1="134" x2="264" y2="42" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="92" x2="264" y2="42" stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" />

      {/* QR බාහුවේ සමාන ලකුණු දෙක (Double Tick) */}
      <g transform="translate(240,88) rotate(27)">
        <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#d91b5c" strokeWidth="2" />
        <line x1="-6" y1="3" x2="6" y2="3" stroke="#d91b5c" strokeWidth="2" />
      </g>

      {/* PR කර්ණයේ තනි සමාන ලකුණ (Single Tick) */}
      <g transform="translate(200,67) rotate(69)">
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#d91b5c" strokeWidth="2" />
      </g>

      {/* PQR අකුරු (Labels) */}
      <text x="122" y="96" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>P</text>
      <text x="214" y="150" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>Q</text>
      <text x="268" y="38" fontSize="13" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill={labelColor}>R</text>
    </svg>
  );
}
  // 9. ත්‍රිකෝණයක බාහිර කෝණය පිළිබඳ ප්‍රමේයය
if (id === 9) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* කෝණ වර්ණ ගැන්වීම (Sectors) */}
      <path d="M 50 20 L 41 33 A 15 15 0 0 0 59 33 Z" fill="#ff00ff" /> {/* කෝණය a */}
      <path d="M 20 72 L 35 72 A 15 15 0 0 0 29 61 Z" fill="#ffcc00" /> {/* කෝණය b */}
      <path d="M 80 72 L 95 72 A 15 15 0 0 0 74 58 Z" fill="#99cc33" /> {/* බාහිර කෝණය a+b */}

      {/* රේඛා ඇඳීම */}
      <line x1="20" y1="72" x2="110" y2="72" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* BC රේඛාව දික් කර */}
      <line x1="20" y1="72" x2="50" y2="20" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* AB රේඛාව */}
      <line x1="50" y1="20" x2="80" y2="72" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* AC රේඛාව */}

      {/* අකුරු සහ ලේබල් */}
      <text x="46" y="15" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
      <text x="14" y="82" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
      <text x="76" y="82" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>
      <text x="106" y="82" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>D</text>

      {/* කෝණ අගයන් */}
      <text x="47" y="32" fontSize="9" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>a</text>
      <text x="25" y="69" fontSize="9" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>b</text>
      <text x="81" y="67" fontSize="8" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>a +b</text>
    </svg>
  );
}
// 10. ත්‍රිකෝණයක කෝණ තුනෙහි ඓක්‍යය පිළිබඳ ප්‍රමේයය
if (id === 10) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* කෝණ වර්ණ ගැන්වීම (Sectors) */}
      <path d="M 60 20 L 51 33 A 15 15 0 0 0 69 33 Z" fill="#ffff00" /> {/* කෝණය a - Yellow */}
      <path d="M 30 72 L 45 72 A 15 15 0 0 0 39 61 Z" fill="#ffcc00" /> {/* කෝණය b - Gold/Orange */}
      <path d="M 90 72 L 75 72 A 15 15 0 0 1 81 61 Z" fill="#ff00ff" /> {/* කෝණය c - Pink */}

      {/* ත්‍රිකෝණය ඇඳීම */}
      <line x1="30" y1="72" x2="90" y2="72" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* BC පාදය */}
      <line x1="30" y1="72" x2="60" y2="20" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* AB පාදය */}
      <line x1="60" y1="20" x2="90" y2="72" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" /> {/* AC පාදය */}

      {/* අකුරු සහ ලේබල් */}
      <text x="56" y="15" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>A</text>
      <text x="24" y="82" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>B</text>
      <text x="88" y="82" fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>C</text>

      {/* කෝණ අගයන් */}
      <text x="57" y="32" fontSize="9" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>a</text>
      <text x="35" y="69" fontSize="9" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>b</text>
      <text x="79" y="69" fontSize="9" fill="#000" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle}>c</text>
    </svg>
  );
}
// 11. බහුඅස්‍රයක අභ්‍යන්තර හා බාහිර කෝණ පිළිබඳ ප්‍රමේයය (100% නිවැරදි ජ්‍යාමිතික ගණනය කිරීම් සහිතව)
if (id === 11) {
  return (
    <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* සම්පූර්ණ රූපය ෆොටෝ එකේ විදිහට අංශක 15ක් ඇල කිරීම */}
      <g transform="rotate(-15, 75, 75)">
        
        {/* e - Right Node */}
        <g transform="rotate(0, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* d - Bottom Right Node */}
        <g transform="rotate(60, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* c - Bottom Left Node */}
        <g transform="rotate(120, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* b - Left Node */}
        <g transform="rotate(180, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* a - Top Left Node */}
        <g transform="rotate(240, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* f - Top Right Node */}
        <g transform="rotate(300, 75, 75)">
          <path d="M 115 75 L 107.5 62 A 15 15 0 0 0 107.5 88 Z" fill="#ff0000" stroke="#000" strokeWidth="0.5" />
          <path d="M 115 75 L 122.5 62 A 15 15 0 0 0 107.5 62 Z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
          <line x1="95" y1="109.64" x2="127.5" y2="53.35" stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>

      </g>

      {/* අභ්‍යන්තර කෝණ අකුරු (Red background -> White Text) */}
      <g fontSize="10" fontWeight="bold" fontStyle="italic" fill="#ffffff" fontFamily={fontStyle}>
        <text x="53" y="54">a</text>
        <text x="44" y="86">b</text>
        <text x="63" y="105">c</text>
        <text x="92" y="99">d</text>
        <text x="103" y="68">e</text>
        <text x="81" y="47">f</text>
      </g>

      {/* බාහිර කෝණ අකුරු (Yellow background -> Black Text) */}
      <g fontSize="10" fontWeight="bold" fontStyle="italic" fill="#000000" fontFamily={fontStyle}>
        <text x="37" y="57">p</text>
        <text x="35" y="95">q</text>
        <text x="74" y="120">r</text>
        <text x="110" y="98">s</text>
        <text x="110" y="58">t</text>
        <text x="72" y="34">u</text>
      </g>
      
    </svg>
  );
}
// 13. සමද්වීපාද ත්‍රිකෝණ ප්‍රමේයය (කෝණ සමාන නම් සම්මුඛ පාද සමාන වේ)
if (id === 12) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* වම්පස කෝණය b සඳහා පාට පිරවීම */}
      <path d="M 30 75 L 45 75 A 15 15 0 0 0 37.5 62 Z" fill="#21bee6" />
      {/* දකුණුපස කෝණය c සඳහා පාට පිරවීම */}
      <path d="M 90 75 L 82.5 62 A 15 15 0 0 0 75 75 Z" fill="#21bee6" />

      {/* ත්‍රිකෝණය ABC ඇඳීම */}
      <polygon points="60,20 30,75 90,75" fill="none" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* පාද සමාන බව පෙන්වන සමාන්තර ඉරි කෑලි දෙක (Marks) */}
      {/* AB පාදය මත ඉරි කෑල්ල */}
      <line x1="42" y1="45" x2="48" y2="49" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="43" x2="50" y2="47" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      {/* AC පාදය මත ඉරි කෑල්ල */}
      <line x1="72" y1="49" x2="78" y2="45" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="47" x2="76" y2="43" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />

      {/* ශීර්ෂ සඳහා ලේබල් (Labels for Vertices) */}
      <text x="60" y="14" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">A</text>
      <text x="22" y="82" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">B</text>
      <text x="98" y="82" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">C</text>

      {/* කෝණ සඳහා අකුරු (b සහ c) */}
      <text x="40" y="71" fontSize="10" fill="#2d1609" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} textAnchor="middle">b</text>
      <text x="80" y="71" fontSize="10" fill="#2d1609" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} textAnchor="middle">c</text>
    </svg>
  );
}
  // 13. සමද්වීපාද ත්‍රිකෝණ ප්‍රමේයය (කෝණ සමාන නම් සම්මුඛ පාද සමාන වේ)
if (id === 13) {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* වම්පස කෝණය b සඳහා පාට පිරවීම */}
      <path d="M 30 75 L 45 75 A 15 15 0 0 0 37.5 62 Z" fill="#4d2b75" />
      {/* දකුණුපස කෝණය c සඳහා පාට පිරවීම */}
      <path d="M 90 75 L 82.5 62 A 15 15 0 0 0 75 75 Z" fill="#4d2b75" />

      {/* ත්‍රිකෝණය ABC ඇඳීම */}
      <polygon points="60,20 30,75 90,75" fill="none" stroke={lineStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* පාද සමාන බව පෙන්වන සමාන්තර ඉරි කෑලි දෙක (Marks) */}
      {/* AB පාදය මත ඉරි කෑල්ල */}
      <line x1="42" y1="45" x2="48" y2="49" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="43" x2="50" y2="47" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      {/* AC පාදය මත ඉරි කෑල්ල */}
      <line x1="72" y1="49" x2="78" y2="45" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="47" x2="76" y2="43" stroke={lineStroke} strokeWidth="2" strokeLinecap="round" />

      {/* ශීර්ෂ සඳහා ලේබල් (Labels for Vertices) */}
      <text x="60" y="14" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">A</text>
      <text x="22" y="82" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">B</text>
      <text x="98" y="82" fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill={labelColor} textAnchor="middle">C</text>

      {/* කෝණ සඳහා අකුරු (b සහ c) */}
      <text x="40" y="71" fontSize="10" fill="#ffffff" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} textAnchor="middle">b</text>
      <text x="80" y="71" fontSize="10" fill="#ffffff" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} textAnchor="middle">c</text>
    </svg>
  );
}
// 15. සමාන්තරාස්‍ර ප්‍රමේයය (Parallelogram Theorem) - රූපයට 100%ක් සමාන සංස්කරණය
if (id === 14) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- සමාන්තර ඊතල සලකුණු (Parallel Arrows - තද නිල්/දම් පාටින්) ---------------- */}
      {/* AB බාහුවේ තනි ඊතලය */}
      <path d="M 145 145 L 155 150 L 145 155" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* DC බාහුවේ තනි ඊතලය */}
      <path d="M 205 45 L 215 50 L 205 55" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* AD බාහුවේ ද්විත්ව ඊතල (Double Arrows) */}
      <g transform="translate(80,100) rotate(-59)">
        <path d="M -8 -5 L 2 0 L -8 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2 -5 L 12 0 L 2 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* BC බාහුවේ ද්විත්ව ඊතල (Double Arrows) */}
      <g transform="translate(280,100) rotate(-59)">
        <path d="M -8 -5 L 2 0 L -8 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2 -5 L 12 0 L 2 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
// 15. සමාන්තරාස්‍ර ප්‍රමේයය (Parallelogram Theorem) - රූපයට 100%ක් සමාන සංස්කරණය
if (id === 15) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- සමාන්තර ඊතල සලකුණු (Parallel Arrows - තද නිල්/දම් පාටින්) ---------------- */}
      {/* AB බාහුවේ තනි ඊතලය */}
      <path d="M 145 145 L 155 150 L 145 155" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* DC බාහුවේ තනි ඊතලය */}
      <path d="M 205 45 L 215 50 L 205 55" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* AD බාහුවේ ද්විත්ව ඊතල (Double Arrows) */}
      <g transform="translate(80,100) rotate(-59)">
        <path d="M -8 -5 L 2 0 L -8 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2 -5 L 12 0 L 2 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* BC බාහුවේ ද්විත්ව ඊතල (Double Arrows) */}
      <g transform="translate(280,100) rotate(-59)">
        <path d="M -8 -5 L 2 0 L -8 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 2 -5 L 12 0 L 2 5" fill="none" stroke="#3d007a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
// 15. සමාන්තරාස්‍ර ප්‍රමේයය (Parallelogram Theorem) - රූපයට 100%ක් සමාන සංස්කරණය
if (id === 16) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
if (id === 17) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
if (id === 18) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
if (id === 19) {
  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
      {/* ---------------- කෝණ සලකුණු (Angle Sectors) ---------------- */}
      {/* A කෝණය (කොළ පාට) */}
      <path d="M 50 150 L 80 150 A 30 30 0 0 0 65.4 124.3 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* C කෝණය (කොළ පාට) */}
      <path d="M 310 50 L 280 50 A 30 30 0 0 0 294.6 75.7 Z" fill="#3bb143" stroke="#000" strokeWidth="0.5" />
      {/* D කෝණය (කහ පාට) */}
      <path d="M 110 50 L 140 50 A 30 30 0 0 1 94.6 75.7 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />
      {/* B කෝණය (කහ පාට) */}
      <path d="M 250 150 L 220 150 A 30 30 0 0 1 265.4 124.3 Z" fill="#fdca40" stroke="#000" strokeWidth="0.5" />

      {/* ---------------- විකර්ණ (Diagonals - ලා නිල් පාටින්) ---------------- */}
      {/* AC විකර්ණය */}
      <line x1="50" y1="150" x2="310" y2="50" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* DB විකර්ණය */}
      <line x1="110" y1="50" x2="250" y2="150" stroke="#00a2ed" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---------------- සමාන්තරාස්‍රයේ බාහු (Pink Outline) ---------------- */}
      {/* AB බාහුව */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" /> 
      {/* BC බාහුව */}
      <line x1="250" y1="150" x2="310" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />  
      {/* CD බාහුව */}
      <line x1="310" y1="50" x2="110" y2="50" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   
      {/* DA බාහුව */}
      <line x1="110" y1="50" x2="50" y2="150" stroke="#e8337a" strokeWidth="2.5" strokeLinecap="round" />   

      {/* ---------------- විකර්ණ වල සමානතා සලකුණු (Ticks - කොළ පාටින්) ---------------- */}
      {/* AO කොටසේ තනි ඉර */}
      <g transform="translate(115,125) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OC කොටසේ තනි ඉර */}
      <g transform="translate(245,75) rotate(69)">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* DO කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(145,75) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>
      {/* OB කොටසේ ද්විත්ව ඉරි */}
      <g transform="translate(215,125) rotate(126)">
        <line x1="-6" y1="-2.5" x2="6" y2="-2.5" stroke="#00a86b" strokeWidth="2.5" />
        <line x1="-6" y1="2.5" x2="6" y2="2.5" stroke="#00a86b" strokeWidth="2.5" />
      </g>

      {/* ---------------- අකුරු (Labels - රූපයේ පරිදි රතු පැහැයෙන්) ---------------- */}
      <text x="35" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">A</text>
      <text x="252" y="168" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">B</text>
      <text x="315" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">C</text>
      <text x="95" y="44" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">D</text>
      <text x="168" y="94" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily={fontStyle} fill="#e60000">O</text>
    </svg>
  );
}
// 20. මධ්‍ය ලක්ෂ්‍ය ප්‍රමේයය
  if (id === 20) {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* ත්‍රිකෝණයේ පාද සහ මධ්‍ය රේඛාව */}
        <path d="M 100 30 L 40 120 L 160 120 Z" fill="none" stroke="#ff007f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="70" y1="75" x2="130" y2="75" stroke="#ff007f" strokeWidth="2.5" strokeLinecap="round" />

        {/* AD සහ DB සමාන බව පෙන්වන තනි ඉරි (නිල් පැහැති) */}
        <line x1="79" y1="49" x2="89" y2="56" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="49" y1="94" x2="59" y2="101" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* AE සහ EC සමාන බව පෙන්වන ද්විත්ව ඉරි (නිල් පැහැති) */}
        <line x1="108" y1="53" x2="118" y2="46" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="112" y1="59" x2="122" y2="52" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="138" y1="98" x2="148" y2="91" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="142" y1="104" x2="152" y2="97" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* අකුරු (Labels) */}
        <text x="94" y="22" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">A</text>
        <text x="24" y="136" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">B</text>
        <text x="162" y="136" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">C</text>
        <text x="50" y="76" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">D</text>
        <text x="138" y="76" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">E</text>
      </svg>
    );
  }
  // 21. මධ්‍ය ලක්ෂ්‍ය ප්‍රමේයයෙහි විලෝමය
  if (id === 21) {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* ත්‍රිකෝණයේ පාද සහ අභ්‍යන්තර රේඛාව */}
        <path d="M 100 30 L 40 120 L 160 120 Z" fill="none" stroke="#ff007f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="70" y1="75" x2="130" y2="75" stroke="#ff007f" strokeWidth="2.5" strokeLinecap="round" />

        {/* AD සහ DB සමාන බව පෙන්වන තනි ඉරි (නිල් පැහැති) */}
        <line x1="79" y1="49" x2="89" y2="56" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="49" y1="94" x2="59" y2="101" stroke="#00b0f0" strokeWidth="2.5" strokeLinecap="round" />

        {/* DE සහ BC සමාන්තර බව පෙන්වන ඊතල සලකුණු (කොළ පැහැති) */}
        <path d="M 95 70 L 105 75 L 95 80" fill="none" stroke="#00a651" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 95 115 L 105 120 L 95 125" fill="none" stroke="#00a651" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* අකුරු (Labels) */}
        <text x="94" y="22" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">A</text>
        <text x="24" y="136" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">B</text>
        <text x="162" y="136" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">C</text>
        <text x="50" y="76" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">D</text>
        <text x="138" y="76" fontSize="16" fontWeight="bold" fontFamily={fontStyle} fill="#ff0000" fontStyle="italic">E</text>
      </svg>
    );
  }
  // 21. මධ්‍ය ලක්ෂ්‍ය ප්‍රමේයයෙහි විලෝමය
  if (id === 22) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      
        {/* --- රේඛා (සමාන්තරාස්‍ර දෙකෙහි පාද) --- */}
        {/* ABCD සමාන්තරාස්‍රය (DA සහ CB නිල් රේඛා) */}
        <line x1="12" y1="35" x2="42" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />
        <line x1="82" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* ABPQ සමාන්තරාස්‍රය (QA සහ PB නිල් රේඛා) */}
        <line x1="67" y1="35" x2="42" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />
        <line x1="137" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* තිරස් නිල් පාදයන් (DC, QP, AB) */}
        <line x1="12" y1="35" x2="137" y2="35" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="85" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* --- ඊතල සලකුණු --- */}
        {/* DA මත පහළට ඇති රතු ත්‍රිත්ව (>>>) ඊතල */}
        <g transform="translate(27, 60) rotate(59)">
          <path d="M-5,-3 L0,0 L-5,3 M0,-3 L5,0 L0,3 M5,-3 L10,0 L5,3" fill="none" stroke="#e50012" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        {/* CB මත පහළට ඇති රතු ත්‍රිත්ව (>>>) ඊතල */}
        <g transform="translate(97, 60) rotate(59)">
          <path d="M-5,-3 L0,0 L-5,3 M0,-3 L5,0 L0,3 M5,-3 L10,0 L5,3" fill="none" stroke="#e50012" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* QA මත ඉහළට ඇති කොළ ද්විත්ව (>>) ඊතල */}
        <g transform="translate(54.5, 60) rotate(-59)">
          <path d="M-4,-2.5 L1,0 L-4,2.5 M1,-2.5 L6,0 L1,2.5" fill="none" stroke="#00a650" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        {/* PB මත ඉහළට ඇති කොළ ද්විත්ව (>>) ඊතල */}
        <g transform="translate(124.5, 60) rotate(-59)">
          <path d="M-4,-2.5 L1,0 L-4,2.5 M1,-2.5 L6,0 L1,2.5" fill="none" stroke="#00a650" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* QC මැද ඇති දම් තනි ඊතලය */}
        <path d="M 74 32 L 78 35 L 74 38" fill="none" stroke="#4a2582" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        {/* AB මැද ඇති දම් තනි ඊතලය */}
        <path d="M 74 82 L 78 85 L 74 88" fill="none" stroke="#4a2582" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- ලක්ෂ්‍ය ලේබල් --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="10" y="27" textAnchor="middle">D</text>
          <text x="65" y="27" textAnchor="middle">Q</text>
          <text x="82" y="27" textAnchor="middle">C</text>
          <text x="139" y="27" textAnchor="middle">P</text>
          <text x="38" y="97" textAnchor="middle">A</text>
          <text x="116" y="97" textAnchor="middle">B</text>
        </g>
      </svg>
    );
  }
// G11_ජ්‍යාමිතිය ප්‍රමේයය 23 රූප සටහන
  // ත්‍රිකෝණයක් ද සමාන්තරාස්‍රයක් ද එකම ආධාරකයක් මත හා එකම සමාන්තර රේඛා යුගලක් අතර පිහිටා ඇත්නම් ත්‍රිකෝණයේ වර්ගඵලය සමාන්තරාස්‍රයේ වර්ගඵලයෙන් අඩක් වේ.
  if (id === 23) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
       {/* --- රේඛා (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        {/* DA සහ CB (වමට ඇල වූ රේඛා) */}
        <line x1="12" y1="35" x2="42" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* DA */}
        <line x1="82" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* CB */}

        {/* BE (දකුණට ඇල වූ රේඛාව) */}
        <line x1="137" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* BE */}

        {/* AE (මැදින් යන රේඛාව) */}
        <line x1="42" y1="85" x2="137" y2="35" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AE */}

        {/* තිරස් පාදයන් (DE සහ AB) */}
        <line x1="12" y1="35" x2="137" y2="35" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="85" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

       {/* DA සහ CB මත ඉහළට ඇති ද්විත්ව (>>) ඊතල */}
        <g transform="translate(27, 60) rotate(-114)">
          <path d="M-4,-3 L1,0 L-4,3 M1,-3 L6,0 L1,3" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <g transform="translate(97, 60) rotate(-114)">
          <path d="M-4,-3 L1,0 L-4,3 M1,-3 L6,0 L1,3" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        {/* DC මැද සහ AB මැද ඇති දකුණට විහිදෙන තනි ඊතල (>) */}
        <path d="M 52 32 L 56 35 L 52 38" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 74 82 L 78 85 L 74 88" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ලක්ෂ්‍ය ලේබල් (D, C, E, A, B) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="10" y="27" textAnchor="middle">D</text>
          <text x="82" y="27" textAnchor="middle">C</text>
          <text x="139" y="27" textAnchor="middle">E</text>
          <text x="38" y="97" textAnchor="middle">A</text>
          <text x="116" y="97" textAnchor="middle">B</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය ප්‍රමේයය 24 රූප සටහන
  // එකම ආධාරකයක් මත හා එකම සමාන්තර රේඛා යුගලක් අතර පිහිටි ත්‍රිකෝණවල වර්ගඵල සමාන වේ.
  if (id === 24) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- රේඛා (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        {/* DA සහ CB (පිටතින්ම ඇති ඇල රේඛා දෙක) */}
        <line x1="12" y1="35" x2="42" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* DA */}
        <line x1="137" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* CB */}

        {/* DB සහ AC (මැදින් එකිනෙක කැපී යන විකර්ණ රේඛා දෙක) */}
        <line x1="12" y1="35" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* DB */}
        <line x1="42" y1="85" x2="137" y2="35" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AC */}

        {/* තිරස් පාදයන් (DC සහ AB) */}
        <line x1="12" y1="35" x2="137" y2="35" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="85" x2="112" y2="85" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* --- ඊතල සලකුණු (පොතේ පරිදිම තද රතු පාටින්) --- */}
        {/* DC මැද සහ AB මැද ඇති දකුණට විහිදෙන තනි ඊතල (>) */}
        <path d="M 72 32 L 76 35 L 72 38" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 74 82 L 78 85 L 74 88" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ලක්ෂ්‍ය ලේබල් (D, C, A, B) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="10" y="27" textAnchor="middle">D</text>
          <text x="139" y="27" textAnchor="middle">C</text>
          <text x="38" y="97" textAnchor="middle">A</text>
          <text x="116" y="97" textAnchor="middle">B</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය ප්‍රමේයය 25 රූප සටහන
  // එකම ශීර්ෂය ඇති සහ ආධාරක එකම සරල රේඛාවක පිහිටි ත්‍රිකෝණවල වර්ගඵල ඒවායේ ආධාරකවල දිගට සමානුපාතික වේ.
  if (id === 25) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- රේඛා (පොතේ පරිදිම දම්/මජෙන්ටා පාටින්) --- */}
        {/* පිටත ත්‍රිකෝණයේ රේඛා (AB සහ AC) */}
        <line x1="50" y1="35" x2="15" y2="90" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AB */}
        <line x1="50" y1="35" x2="135" y2="90" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AC */}

        {/* මැදින් යන බෙදුම් රේඛාව (AD) */}
        <line x1="50" y1="35" x2="80" y2="90" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AD */}

        {/* තිරස් බිම් රේඛාව (BC) */}
        <line x1="15" y1="90" x2="135" y2="90" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* BC */}

        {/* ලක්ෂ්‍ය ලේබල් (A, B, D, C) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="50" y="27" textAnchor="middle">A</text>
          <text x="10" y="102" textAnchor="middle">B</text>
          <text x="80" y="102" textAnchor="middle">D</text>
          <text x="140" y="102" textAnchor="middle">C</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය පයිතගරස් ප්‍රමේයය රූප සටහන
  // ඍජුකෝණී ත්‍රිකෝණයක කර්ණය මත අඳින ලද සමචතුරස්‍රයේ වර්ගඵලය...
  if (id === 26) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- රේඛා (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        {/* ඍජුකෝණී ත්‍රිකෝණයේ පාදයන් (AB, BC, AC) */}
        <line x1="35" y1="30" x2="35" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AB */}
        <line x1="35" y1="95" x2="130" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* BC */}
        <line x1="35" y1="30" x2="130" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AC */}

        {/* --- ඍජුකෝණ සලකුණ (පොතේ පරිදිම මජෙන්ටා/රෝස පාටින්) --- */}
        <path d="M 35 86 L 44 86 L 44 95" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, C) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="35" y="23" textAnchor="middle">A</text>
          <text x="27" y="106" textAnchor="middle">B</text>
          <text x="130" y="106" textAnchor="middle">C</text>
        </g>

        {/* --- පාදවල දිග ලේබල් (a, b, c - කොළ පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#22c55e">
          <text x="22" y="66" textAnchor="middle">a</text>
          <text x="82" y="107" textAnchor="middle">b</text>
          <text x="88" y="60" textAnchor="middle">c</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය සමානුපාතිකතා ප්‍රමේයය රූප සටහන
  // ත්‍රිකෝණයක එක පාදයකට සමාන්තරව ඇඳි සරල රේඛාවක් මඟින් ඉතිරි පාද සමානුපාතිකව බෙදයි.
  if (id === 27) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- රේඛා (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        {/* ප්‍රධාන ත්‍රිකෝණයේ බාහිර රේඛා (AB, AC, BC) */}
        <line x1="55" y1="20" x2="15" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AB */}
        <line x1="55" y1="20" x2="130" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AC */}
        <line x1="15" y1="95" x2="130" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* BC */}

        {/* මැදින් යන සමාන්තර රේඛාව (DE) */}
        <line x1="32" y1="63" x2="98" y2="63" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* DE */}

        {/* --- ඊතල සලකුණු (DE සහ BC මැද ඇති මජෙන්ටා/රෝස තනි ඊතල) --- */}
        <path d="M 62 60 L 66 63 L 62 66" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 92 L 74 95 L 70 98" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- ලක්ෂ්‍ය ලේබල් (A, D, E, B, C - රතු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="55" y="15" textAnchor="middle">A</text>
          <text x="22" y="66" textAnchor="middle">D</text>
          <text x="108" y="66" textAnchor="middle">E</text>
          <text x="10" y="106" textAnchor="middle">B</text>
          <text x="135" y="106" textAnchor="middle">C</text>
        </g>

        {/* --- කොටස්වල දිග ලේබල් (x, y, p, q - කළු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#000000">
          <text x="31" y="44" textAnchor="middle">x</text>
          <text x="12" y="84" textAnchor="middle">y</text>
          <text x="88" y="44" textAnchor="middle">p</text>
          <text x="125" y="84" textAnchor="middle">q</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය තේල්ස් ප්‍රමේයයේ විලෝමය රූප සටහන
  // සරල රේඛාවක් මඟින් ත්‍රිකෝණයක පාද දෙකක් සමානුපාතිකව බෙදේ නම් ඒ සරල රේඛාව ඉතිරි පාදයට සමාන්තර වේ.
  if (id === 28) {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- රේඛා (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        {/* ප්‍රධාන ත්‍රිකෝණයේ බාහිර රේඛා (AB, AC, BC) */}
        <line x1="65" y1="20" x2="25" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AB */}
        <line x1="65" y1="20" x2="135" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* AC */}
        <line x1="25" y1="95" x2="135" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* BC */}

        {/* මැදින් යන බෙදුම් රේඛාව (DE - මෙයට ඊතල නැත) */}
        <line x1="42" y1="63" x2="105" y2="63" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" /> {/* DE */}

        {/* --- ලක්ෂ්‍ය ලේබල් (A, D, E, B, C - රතු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill={labelColor}>
          <text x="65" y="15" textAnchor="middle">A</text>
          <text x="32" y="66" textAnchor="middle">D</text>
          <text x="115" y="66" textAnchor="middle">E</text>
          <text x="18" y="106" textAnchor="middle">B</text>
          <text x="140" y="106" textAnchor="middle">C</text>
        </g>

        {/* --- කොටස්වල දිග ලේබල් (x, y, p, q - කළු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#000000">
          <text x="43" y="44" textAnchor="middle">x</text>
          <text x="23" y="84" textAnchor="middle">y</text>
          <text x="94" y="44" textAnchor="middle">p</text>
          <text x="130" y="84" textAnchor="middle">q</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය ප්‍රමේයය 29 රූප සටහන
  // ත්‍රිකෝණ දෙකක් සමකෝණී වේ නම් එම ත්‍රිකෝණ දෙකේ අනුරූප පාද සමානුපාතික වේ.
  if (id === 29) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* ========================================== */}
        {/* 1. පළමු ත්‍රිකෝණය (ABC) */}
        {/* ========================================== */}
        
        {/* ABC පාද - පොතේ පරිදිම නිවැරදි වර්ණවලින් */}
        <line x1="50" y1="35" x2="15" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AB (තද රෝස) */}
        <line x1="50" y1="35" x2="100" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AC (තද රෝස) */}
        <line x1="15" y1="105" x2="100" y2="105" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* BC (කොළ පාට) */}

        {/* ශීර්ෂය A - කෝණ සලකුණ (කොළ පාටින් පිරවූ චාපය සහ රේඛා දෙක) */}
        <path d="M 44 47 A 15 15 0 0 0 56 47 L 50 35 Z" fill="#22c55e" opacity="0.3" />
        <path d="M 44 47 A 15 15 0 0 0 56 47" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M 41 51 A 20 20 0 0 0 59 51" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        
        {/* ශීර්ෂය B - කෝණ සලකුණ (තද රෝස/මජෙන්ටා පාටින් පිරවූ චාපය) */}
        <path d="M 27 105 A 13 13 0 0 0 23 92 L 15 105 Z" fill="#ec4899" opacity="0.8" />
        <path d="M 27 105 A 13 13 0 0 0 23 92" fill="none" stroke="#ec4899" strokeWidth="1.5" />

        {/* ශීර්ෂය C - කෝණ සලකුණ (කළු පාටින් පිරවූ චාපය සහ තීරු තුන) */}
        <path d="M 87 105 A 13 13 0 0 0 94 96 L 100 105 Z" fill="#eab308" opacity="0.7" />
        <path d="M 87 105 A 13 13 0 0 0 94 96" fill="none" stroke="#000000" strokeWidth="2" />
        <path d="M 84 105 A 16 16 0 0 0 92 93" fill="none" stroke="#000000" strokeWidth="1.2" />
        <path d="M 81 105 A 19 19 0 0 0 90 90" fill="none" stroke="#000000" strokeWidth="1.2" />

        {/* ලක්ෂ්‍ය ලේබල් (A, B, C - රතු පාටින්) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="50" y="27" textAnchor="middle">A</text>
          <text x="10" y="117" textAnchor="middle">B</text>
          <text x="106" y="117" textAnchor="middle">C</text>
        </g>


        {/* ========================================== */}
        {/* 2. දෙවැනි ත්‍රිකෝණය (DEF) */}
        {/* ========================================== */}
        
        {/* DEF පාද - පොතේ පරිදිම නිවැරදි වර්ණවලින් */}
        <line x1="165" y1="30" x2="225" y2="125" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* DE (කොළ පාට) */}
        <line x1="225" y1="125" x2="265" y2="60" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* EF (තද රෝස) */}
        <line x1="165" y1="30" x2="265" y2="60" stroke="#eab308" strokeWidth="2" strokeLinecap="round" /> {/* DF (කහ/රන්වන්) */}

        {/* ශීර්ෂය D - කෝණ සලකුණ (තද රෝස/මජෙන්ටා පාටින් පිරවූ චාපය) */}
        <path d="M 172 41 A 15 15 0 0 1 176 33 L 165 30 Z" fill="#ec4899" opacity="0.8" />
        <path d="M 172 41 A 15 15 0 0 1 176 33" fill="none" stroke="#ec4899" strokeWidth="1.5" />

        {/* ශීර්ෂය E - කෝණ සලකුණ (කළු පාටින් පිරවූ චාපය සහ තීරු තුන) */}
        <path d="M 221 112 A 15 15 0 0 1 234 115 L 225 125 Z" fill="#eab308" opacity="0.7" />
        <path d="M 221 112 A 15 15 0 0 1 234 115" fill="none" stroke="#000000" strokeWidth="2" />
        <path d="M 218 108 A 19 19 0 0 1 235 112" fill="none" stroke="#000000" strokeWidth="1.2" />
        <path d="M 215 104 A 23 23 0 0 1 236 108" fill="none" stroke="#000000" strokeWidth="1.2" />

        {/* ශීර්ෂය F - කෝණ සලකුණ (කොළ පාටින් පිරවූ චාපය සහ රේඛා දෙක) */}
        <path d="M 251 56 A 15 15 0 0 0 255 70 L 265 60 Z" fill="#22c55e" opacity="0.3" />
        <path d="M 251 56 A 15 15 0 0 0 255 70" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M 247 55 A 19 19 0 0 0 252 73" fill="none" stroke="#22c55e" strokeWidth="1.5" />

        {/* ලක්ෂ්‍ය ලේබල් (D, E, F - රතු පාටින්) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="155" y="32" textAnchor="middle">D</text>
          <text x="225" y="137" textAnchor="middle">E</text>
          <text x="274" y="62" textAnchor="middle">F</text>
        </g>

      </svg>
    );
  }
   // G11_ජ්‍යාමිතිය ප්‍රමේයය 29 රූප සටහන
  // ත්‍රිකෝණ දෙකක් සමකෝණී වේ නම් එම ත්‍රිකෝණ දෙකේ අනුරූප පාද සමානුපාතික වේ.
  if (id === 30) {
    return (
      <svg viewBox="0 0 300 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* ========================================== */}
        {/* 1. පළමු ත්‍රිකෝණය (ABC) */}
        {/* ========================================== */}
        
        {/* ABC පාද - පොතේ පරිදිම නිවැරදි වර්ණවලින් */}
        <line x1="50" y1="35" x2="15" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AB (තද රෝස) */}
        <line x1="50" y1="35" x2="100" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AC (තද රෝස) */}
        <line x1="15" y1="105" x2="100" y2="105" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* BC (කොළ පාට) */}

        {/* ශීර්ෂය A - කෝණ සලකුණ (කොළ පාටින් පිරවූ චාපය සහ රේඛා දෙක) */}
        <path d="M 44 47 A 15 15 0 0 0 56 47 L 50 35 Z" fill="#22c55e" opacity="0.3" />
        <path d="M 44 47 A 15 15 0 0 0 56 47" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M 41 51 A 20 20 0 0 0 59 51" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        
        {/* ශීර්ෂය B - කෝණ සලකුණ (තද රෝස/මජෙන්ටා පාටින් පිරවූ චාපය) */}
        <path d="M 27 105 A 13 13 0 0 0 23 92 L 15 105 Z" fill="#ec4899" opacity="0.8" />
        <path d="M 27 105 A 13 13 0 0 0 23 92" fill="none" stroke="#ec4899" strokeWidth="1.5" />

        {/* ශීර්ෂය C - කෝණ සලකුණ (කළු පාටින් පිරවූ චාපය සහ තීරු තුන) */}
        <path d="M 87 105 A 13 13 0 0 0 94 96 L 100 105 Z" fill="#eab308" opacity="0.7" />
        <path d="M 87 105 A 13 13 0 0 0 94 96" fill="none" stroke="#000000" strokeWidth="2" />
        <path d="M 84 105 A 16 16 0 0 0 92 93" fill="none" stroke="#000000" strokeWidth="1.2" />
        <path d="M 81 105 A 19 19 0 0 0 90 90" fill="none" stroke="#000000" strokeWidth="1.2" />

        {/* ලක්ෂ්‍ය ලේබල් (A, B, C - රතු පාටින්) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="50" y="27" textAnchor="middle">A</text>
          <text x="10" y="117" textAnchor="middle">B</text>
          <text x="106" y="117" textAnchor="middle">C</text>
        </g>


        {/* ========================================== */}
        {/* 2. දෙවැනි ත්‍රිකෝණය (DEF) */}
        {/* ========================================== */}
        
        {/* DEF පාද - පොතේ පරිදිම නිවැරදි වර්ණවලින් */}
        <line x1="165" y1="30" x2="225" y2="125" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* DE (කොළ පාට) */}
        <line x1="225" y1="125" x2="265" y2="60" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* EF (තද රෝස) */}
        <line x1="165" y1="30" x2="265" y2="60" stroke="#eab308" strokeWidth="2" strokeLinecap="round" /> {/* DF (කහ/රන්වන්) */}

        {/* ශීර්ෂය D - කෝණ සලකුණ (තද රෝස/මජෙන්ටා පාටින් පිරවූ චාපය) */}
        <path d="M 172 41 A 15 15 0 0 1 176 33 L 165 30 Z" fill="#ec4899" opacity="0.8" />
        <path d="M 172 41 A 15 15 0 0 1 176 33" fill="none" stroke="#ec4899" strokeWidth="1.5" />

        {/* ශීර්ෂය E - කෝණ සලකුණ (කළු පාටින් පිරවූ චාපය සහ තීරු තුන) */}
        <path d="M 221 112 A 15 15 0 0 1 234 115 L 225 125 Z" fill="#eab308" opacity="0.7" />
        <path d="M 221 112 A 15 15 0 0 1 234 115" fill="none" stroke="#000000" strokeWidth="2" />
        <path d="M 218 108 A 19 19 0 0 1 235 112" fill="none" stroke="#000000" strokeWidth="1.2" />
        <path d="M 215 104 A 23 23 0 0 1 236 108" fill="none" stroke="#000000" strokeWidth="1.2" />

        {/* ශීර්ෂය F - කෝණ සලකුණ (කොළ පාටින් පිරවූ චාපය සහ රේඛා දෙක) */}
        <path d="M 251 56 A 15 15 0 0 0 255 70 L 265 60 Z" fill="#22c55e" opacity="0.3" />
        <path d="M 251 56 A 15 15 0 0 0 255 70" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M 247 55 A 19 19 0 0 0 252 73" fill="none" stroke="#22c55e" strokeWidth="1.5" />

        {/* ලක්ෂ්‍ය ලේබල් (D, E, F - රතු පාටින්) */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="155" y="32" textAnchor="middle">D</text>
          <text x="225" y="137" textAnchor="middle">E</text>
          <text x="274" y="62" textAnchor="middle">F</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (ජ්‍යායෙහි මධ්‍ය ලක්ෂ්‍යය සම්බන්ධ ප්‍රමේයය)
  // වෘත්තයක කේන්ද්‍රයේ සිට ජ්‍යායක මධ්‍ය ලක්ෂ්‍යය යා කරන සරල රේඛාව ජ්‍යායට ලම්බ වේ.
  if (id === 31) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- වෘත්තය (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="70" r="50" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- ජ්‍යාය (AB සරල රේඛාව - ලා නිල් පාටින්) --- */}
        <line x1="32" y1="95" x2="118" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍රයේ සිට ජ්‍යායට ඇති රේඛාව (OC - තද රෝස/මජෙන්ටා පාටින්) --- */}
        <line x1="75" y1="70" x2="75" y2="95" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍ර ලක්ෂ්‍යය (O ලක්ෂ්‍යය මත ඇති කුඩා තිත) --- */}
        <circle cx="75" cy="70" r="1.5" fill="#ec4899" />

        {/* --- ඍජුකෝණ (ලම්බක) සලකුණ (කහ පාටින්) --- */}
        <path d="M 75 87 L 83 87 L 83 95" fill="none" stroke="#eab308" strokeWidth="1.2" strokeLinejoin="round" />

        {/* --- සමාන කොටස් බව පෙන්වන සලකුණු (AC = CB බව දක්වන ද්විත්ව කොළ රේඛා) --- */}
        {/* AC කොටස මැද */}
        <line x1="52" y1="91" x2="52" y2="99" stroke="#22c55e" strokeWidth="1.2" />
        <line x1="55" y1="91" x2="55" y2="99" stroke="#22c55e" strokeWidth="1.2" />
        
        {/* CB කොටස මැද */}
        <line x1="95" y1="91" x2="95" y2="99" stroke="#22c55e" strokeWidth="1.2" />
        <line x1="98" y1="91" x2="98" y2="99" stroke="#22c55e" strokeWidth="1.2" />

        {/* --- ලක්ෂ්‍ය ලේබල් (O, A, C, B - තද රතු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="75" y="62" textAnchor="middle">O</text>
          <text x="23" y="102" textAnchor="middle">A</text>
          <text x="75" y="107" textAnchor="middle">C</text>
          <text x="126" y="102" textAnchor="middle">B</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (කේන්ද්‍රයේ සිට ජ්‍යායට ඇඳි ලම්බකය සම්බන්ධ ප්‍රමේයය)
  // වෘත්තයක කේන්ද්‍රයේ සිට ජ්‍යායකට අඳින ලද ලම්බකයෙන් එම ජ්‍යාය සමච්ඡේදනය වේ.
  if (id === 32) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- වෘත්තය (පොතේ පරිදිම තද රෝස/මජෙන්ටා පාටින්) --- */}
        <circle cx="75" cy="70" r="50" fill="none" stroke="#ec4899" strokeWidth="2" />

        {/* --- ජ්‍යාය (PQ සරල රේඛාව - ලා නිල් පාටින්) --- */}
        <line x1="32" y1="95" x2="118" y2="95" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍රයේ සිට ජ්‍යායට ඇති ලම්බ රේඛාව (OT - දම් පාටින්) --- */}
        <line x1="75" y1="70" x2="75" y2="95" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍ර ලක්ෂ්‍යය (O ලක්ෂ්‍යය මත ඇති කුඩා තිත) --- */}
        <circle cx="75" cy="70" r="1.5" fill="#6b21a8" />

        {/* --- ඍජුකෝණ සලකුණ (ලා නිල් පාටින්) --- */}
        <path d="M 75 87 L 83 87 L 83 95" fill="none" stroke="#00a3e0" strokeWidth="1.2" strokeLinejoin="round" />

        {/* --- සමාන කොටස් බව පෙන්වන සලකුණු (PT = TQ බව දක්වන කහ පාට ද්විත්ව රේඛා) --- */}
        {/* PT කොටස මැද */}
        <line x1="52" y1="91" x2="52" y2="99" stroke="#eab308" strokeWidth="1.2" />
        <line x1="55" y1="91" x2="55" y2="99" stroke="#eab308" strokeWidth="1.2" />
        
        {/* TQ කොටස මැද */}
        <line x1="95" y1="91" x2="95" y2="99" stroke="#eab308" strokeWidth="1.2" />
        <line x1="98" y1="91" x2="98" y2="99" stroke="#eab308" strokeWidth="1.2" />

        {/* --- ලක්ෂ්‍ය ලේබල් (O, P, T, Q - තද රතු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="75" y="62" textAnchor="middle">O</text>
          <text x="23" y="103" textAnchor="middle">P</text>
          <text x="75" y="108" textAnchor="middle">T</text>
          <text x="127" y="103" textAnchor="middle">Q</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (කේන්ද්‍ර කෝණය සහ පරිධි කෝණය සම්බන්ධ ප්‍රමේයය)
  // වෘත්තයක චාපයකින් කේන්ද්‍රය මත සාදන කෝණය, එම චාපයෙන්ම වෘත්තයේ ඉතිරි කොටස මත සාදන කෝණය මෙන් දෙගුණයකි.
  if (id === 33) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="75" r="50" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- වෘත්ත ඛණ්ඩයේ වර්ණ ගැන්වීම (පහළ කහ පාට කොටස) --- */}
        <path d="M 31.7 99.5 A 50 50 0 0 0 118.3 99.5 L 75 75 Z" fill="#facc15" />
        {/* පහළ චාපයේ තද නිල් පාට සීමා රේඛාව */}
        <path d="M 31.7 99.5 A 50 50 0 0 0 118.3 99.5" fill="none" stroke="#1e3a8a" strokeWidth="2.5" />

        {/* --- රේඛා (පොතේ පරිදිම නිවැරදි වර්ණවලින්) --- */}
        {/* පරිධි කෝණයේ පාද (AC සහ BC - කොළ පාටින්) */}
        <line x1="31.7" y1="99.5" x2="75" y2="25" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* AC */}
        <line x1="118.3" y1="99.5" x2="75" y2="25" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /> {/* BC */}

        {/* කේන්ද්‍ර කෝණයේ පාද (OA සහ OB - තද රෝස/මජෙන්ටා පාටින්) */}
        <line x1="75" y1="75" x2="31.7" y2="99.5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* OA */}
        <line x1="75" y1="75" x2="118.3" y2="99.5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* OB */}

        {/* --- කේන්ද්‍ර ලක්ෂ්‍යය (O ලක්ෂ්‍යය මත ඇති කුඩා නිල් තිත) --- */}
        <circle cx="75" cy="75" r="1.5" fill="#00a3e0" />

        {/* --- කෝණ සලකුණු සහ ඒවායේ වර්ණ ගැන්වීම් (රතු පාටින්) --- */}
        {/* C පරිධි කෝණය (රතු චාපය) */}
        <path d="M 69.3 35.2 A 12 12 0 0 0 80.7 35.2 L 75 25 Z" fill="#b91c1c" />
        <path d="M 69.3 35.2 A 12 12 0 0 0 80.7 35.2" fill="none" stroke="#00a3e0" strokeWidth="1.2" />

        {/* O කේන්ද්‍ර කෝණය (රතු චාපය) */}
        <path d="M 64.6 81 A 12 12 0 0 0 85.4 81 L 75 75 Z" fill="#b91c1c" />
        <path d="M 64.6 81 A 12 12 0 0 0 85.4 81" fill="none" stroke="#00a3e0" strokeWidth="1.2" />

        {/* --- කෝණ අගයන් (x සහ 2x - සුදු පාටින්) --- */}
        <g fontSize="10" fontWeight="bold" fontFamily={fontStyle} fill="#fdfdfd" textAnchor="middle">
          <text x="75" y="35">x</text>
          <text x="75" y="84">2x</text>
        </g>

        {/* --- ලක්ෂ්‍ය ලේබල් (C, O, A, B - තද රතු පාටින්) --- */}
        <g fontSize="11" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="75" y="18" textAnchor="middle">C</text>
          <text x="75" y="66" textAnchor="middle">O</text>
          <text x="18" y="108" textAnchor="middle">A</text>
          <text x="132" y="108" textAnchor="middle">B</text>
        </g>

      </svg>
    );
  }
// G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (එකම වෘත්ත ඛණ්ඩයේ කෝණ)
  // වෘත්තයක එකම ඛණ්ඩයේ පිහිටි කෝණ එකිනෙකට සමාන වේ.
  if (id === 34) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- වෘත්තය (ලා නිල් පාටින්) - කේන්ද්‍රය (75,75), අරය 50 --- */}
        <circle cx="75" cy="75" r="50" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- පොදු ආධාරක ජ්‍යාය (AB - කළු පාටින්) --- */}
        {/* A(35, 105) සහ B(115, 105) ලක්ෂ්‍ය හරියටම පරිධිය මත පිහිටයි */}
        <line x1="35" y1="105" x2="115" y2="105" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />

        {/* --- ශීර්ෂයන් වෙත යන රේඛා (පරිධිය මතම පිහිටන ලක්ෂ්‍ය වෙත) --- */}
        
        {/* 1. P ලක්ෂ්‍යයට යන රේඛා: P(27, 61) (කොළ පාටින්) */}
        <line x1="35" y1="105" x2="27" y2="61" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" /> {/* AP */}
        <line x1="115" y1="105" x2="27" y2="61" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" /> {/* BP */}

        {/* 2. Q ලක්ෂ්‍යයට යන රේඛා: Q(61, 27) (තද රතු පාටින්) */}
        <line x1="35" y1="105" x2="61" y2="27" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" /> {/* AQ */}
        <line x1="115" y1="105" x2="61" y2="27" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" /> {/* BQ */}

        {/* 3. R ලක්ෂ්‍යයට යන රේඛා: R(105, 35) (තද රෝස/මජෙන්ටා පාටින්) */}
        <line x1="35" y1="105" x2="105" y2="35" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" /> {/* AR */}
        <line x1="115" y1="105" x2="105" y2="35" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" /> {/* BR */}


        {/* --- කෝණ සලකුණු (Angles) - ගණිතමය වශයෙන් නිවැරදිව රේඛා මතම පිහිටන සේ --- */}
        
        {/* P කෝණය (කහ පැහැති පිරවීම, රතු මායිම) */}
        <path d="M 27 61 L 29.15 72.81 A 12 12 0 0 0 37.73 66.37 Z" fill="#facc15" />
        <path d="M 29.15 72.81 A 12 12 0 0 0 37.73 66.37" fill="none" stroke="#ef4444" strokeWidth="1.5" />

        {/* Q කෝණය (කොළ පැහැති පිරවීම, රතු මායිම) */}
        <path d="M 61 27 L 57.21 38.38 A 12 12 0 0 0 67.83 36.87 Z" fill="#84cc16" />
        <path d="M 57.21 38.38 A 12 12 0 0 0 67.83 36.87" fill="none" stroke="#ef4444" strokeWidth="1.5" />

        {/* R කෝණය (කහ පැහැති පිරවීම, රතු මායිම) */}
        <path d="M 105 35 L 96.51 43.49 A 12 12 0 0 0 106.70 46.88 Z" fill="#facc15" />
        <path d="M 96.51 43.49 A 12 12 0 0 0 106.70 46.88" fill="none" stroke="#ef4444" strokeWidth="1.5" />


        {/* --- කෝණ අගයන් ('x' අකුරු - කළු පාටින්) --- */}
        <g fontSize="10" fontWeight="bold" fontFamily={fontStyle} fill="#000000" textAnchor="middle">
          <text x="32" y="71">x</text>
          <text x="62.5" y="38">x</text>
          <text x="102" y="45">x</text>
        </g>


        {/* --- ලක්ෂ්‍ය ලේබල් (P, Q, R, A, B - තද රතු පාටින්) --- */}
        <g fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="20" y="58" textAnchor="middle">P</text>
          <text x="61" y="20" textAnchor="middle">Q</text>
          <text x="113" y="30" textAnchor="middle">R</text>
          <text x="26" y="115" textAnchor="middle">A</text>
          <text x="124" y="115" textAnchor="middle">B</text>
        </g>

      </svg>
    );
  }
 // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (අර්ධ වෘත්තයක කෝණය)
  // අර්ධ වෘත්තයක පිහිටි කෝණය සෘජුකෝණයක් වේ.
  if (id === 35) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (පොතේ පරිදිම ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="75" r="50" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- වෘත්තයේ කේන්ද්‍රය (O ලක්ෂ්‍යය - නිල් පාට තිත) --- */}
        <circle cx="75" cy="75" r="2" fill="#00a3e0" />

        {/* --- විෂ්කම්භය රේඛාව (AB - තැඹිලි/කහ පාටින්) --- */}
        {/* A(25, 75) සහ B(125, 75) ලක්ෂ්‍ය හරියටම පරිධිය මත කේන්ද්‍රය හරහා යයි */}
        <line x1="25" y1="75" x2="125" y2="75" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

        {/* --- පරිධිය මත P ශීර්ෂය සාදන රේඛා (තද රෝස/මජෙන්ටා පාටින්) --- */}
        {/* P(105, 35) ලක්ෂ්‍යය වෘත්තයේ පරිධිය මත නිවැරදිව පිහිටයි */}
        <line x1="25" y1="75" x2="105" y2="35" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* AP */}
        <line x1="125" y1="75" x2="105" y2="35" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" /> {/* BP */}

        {/* --- P ශීර්ෂයේ සෘජුකෝණ සලකුණ (Right Angle Square - නිල් පාටින්) --- */}
        {/* පොතේ තියෙන විදිහටම රේඛාවල බෑවුමට අනුව නිවැරදිව කැරකැවූ සෘජුකෝණ කොටුව */}
        <path d="M 96.29 39.15 L 99.79 46.16 L 106.80 42.66" fill="none" stroke="#00a3e0" strokeWidth="1.5" strokeLinecap="square" />

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, P, O - තද රතු පාටින්) --- */}
        <g fontSize="12" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c">
          <text x="15" y="79" textAnchor="middle">A</text>
          <text x="135" y="79" textAnchor="middle">B</text>
          <text x="108" y="27" textAnchor="middle">P</text>
          <text x="75" y="90" textAnchor="middle">O</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (වෘත්ත චතුරස්‍රයක සම්මුඛ කෝණ)
  // වෘත්ත චතුරස්‍රයක සම්මුඛ කෝණවල එකතුව 180° කි.
  if (id === 36) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය --- */}
        <circle cx="75" cy="75" r="52" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- කෝණවල පසුබිම් වර්ණ (Filled Angles) --- */}
        {/* A කෝණය (රතු) */}
        <path d="M 75 23 L 63.69 34.31 A 16 16 0 0 0 86.31 34.31 Z" fill="#dc2626" />
        
        {/* B කෝණය (දම්) */}
        <path d="M 23 75 L 34.31 86.31 A 16 16 0 0 0 34.31 63.69 Z" fill="#6b21a8" />
        
        {/* C කෝණය (රතු) */}
        <path d="M 75 127 L 86.31 115.69 A 16 16 0 0 0 63.69 115.69 Z" fill="#dc2626" />
        
        {/* D කෝණය (දම්) */}
        <path d="M 127 75 L 115.69 63.69 A 16 16 0 0 0 115.69 86.31 Z" fill="#6b21a8" />

        {/* --- වෘත්ත චතුරස්‍රයේ බාහිර රේඛා --- */}
        {/* ශීර්ෂයන් A(75, 23), B(23, 75), C(75, 127), D(127, 75) දැන් හරියටම r=52 කේන්ද්‍රය(75,75) මත පිහිටයි */}
        <path d="M 75 23 L 23 75 L 75 127 L 127 75 Z" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" />

        {/* --- කෝණ ඇතුළේ ඇති අකුරු (a, b, c, d - සුදු පාටින්) --- */}
        <g fontSize="13" fontStyle="italic" fontWeight="bold" fontFamily={fontStyle} fill="#ffffff" textAnchor="middle">
          <text x="75" y="37">a</text>
          <text x="34" y="79.5">b</text>
          <text x="75" y="120">c</text>
          <text x="116" y="79.5">d</text>
        </g>

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, C, D - තද රතු පාටින්) --- */}
        <g fontSize="14" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c" textAnchor="middle">
          <text x="75" y="16">A</text>
          <text x="12" y="79.5">B</text>
          <text x="75" y="143">C</text>
          <text x="139" y="79.5">D</text>
        </g>

      </svg>
    );
  }
   if (id === 37) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය --- */}
        <circle cx="75" cy="75" r="52" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- කෝණවල පසුබිම් වර්ණ (Filled Angles) --- */}
        {/* A කෝණය (රතු) */}
        <path d="M 75 23 L 63.69 34.31 A 16 16 0 0 0 86.31 34.31 Z" fill="#dc2626" />
        
        {/* B කෝණය (දම්) */}
        <path d="M 23 75 L 34.31 86.31 A 16 16 0 0 0 34.31 63.69 Z" fill="#6b21a8" />
        
        {/* C කෝණය (රතු) */}
        <path d="M 75 127 L 86.31 115.69 A 16 16 0 0 0 63.69 115.69 Z" fill="#dc2626" />
        
        {/* D කෝණය (දම්) */}
        <path d="M 127 75 L 115.69 63.69 A 16 16 0 0 0 115.69 86.31 Z" fill="#6b21a8" />

        {/* --- වෘත්ත චතුරස්‍රයේ බාහිර රේඛා --- */}
        {/* ශීර්ෂයන් A(75, 23), B(23, 75), C(75, 127), D(127, 75) දැන් හරියටම r=52 කේන්ද්‍රය(75,75) මත පිහිටයි */}
        <path d="M 75 23 L 23 75 L 75 127 L 127 75 Z" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" />

        {/* --- කෝණ ඇතුළේ ඇති අකුරු (a, b, c, d - සුදු පාටින්) --- */}
        <g fontSize="13" fontStyle="italic" fontWeight="bold" fontFamily={fontStyle} fill="#ffffff" textAnchor="middle">
          <text x="75" y="37">a</text>
          <text x="34" y="79.5">b</text>
          <text x="75" y="120">c</text>
          <text x="116" y="79.5">d</text>
        </g>

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, C, D - තද රතු පාටින්) --- */}
        <g fontSize="14" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c" textAnchor="middle">
          <text x="75" y="16">A</text>
          <text x="12" y="79.5">B</text>
          <text x="75" y="143">C</text>
          <text x="139" y="79.5">D</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (වෘත්ත චතුරස්‍රයක බාහිර කෝණය)
  // වෘත්ත චතුරස්‍රයක පාදයක් දික් කළ විට සෑදෙන බාහිර කෝණය, එහි අභ්‍යන්තර සම්මුඛ කෝණයට සමාන වේ.
  if (id === 38) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (රෝස පාටින්) --- */}
        <circle cx="68" cy="78" r="50" fill="none" stroke="#ec4899" strokeWidth="2" />

        {/* --- කෝණවල පසුබිම් වර්ණ (Filled Angles - තද රෝස පාටින්) --- */}
        {/* B අභ්‍යන්තර කෝණය */}
        <path d="M 33 46 L 45.41 43.19 A 13 13 0 0 1 35.81 58.41 Z" fill="#db2777" />
        {/* D බාහිර කෝණය */}
        <path d="M 108 108 L 104.59 95.45 A 13 13 0 0 1 121 108 Z" fill="#db2777" />

        {/* --- කෝණවල චාප රේඛා (Angle Arcs - සිහින් කළු රේඛා) --- */}
        <path d="M 45.41 43.19 A 13 13 0 0 1 35.81 58.41" fill="none" stroke="#000000" strokeWidth="1" />
        <path d="M 104.59 95.45 A 13 13 0 0 1 121 108" fill="none" stroke="#000000" strokeWidth="1" />

        {/* --- වෘත්ත චතුරස්‍රයේ බාහිර රේඛා සහ දික් කළ පාදය (ලා නිල් පාටින්) --- */}
        {/* ශීර්ෂයන් වෘත්තය මත නිරන්තරයෙන්ම පිහිටයි: A(80,31), B(33,46), C(22,108), D(108,108) */}
        {/* CD පාදය E ලක්ෂ්‍යය (138,108) දක්වා තිරස්ව දික් කර ඇත */}
        <path d="M 80 31 L 33 46 L 22 108 L 138 108" fill="none" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 108 108 L 80 31" fill="none" stroke="#00a3e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- කෝණ ඇතුළේ ඇති 'x' අකුරු (සුදු පාටින්) --- */}
        <g fontSize="12" fontStyle="italic" fontFamily={fontStyle} fill="#ffffff" textAnchor="middle">
          <text x="39" y="52">x</text>
          <text x="113.5" y="104">x</text>
        </g>

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, C, D, E - තද කොළ පාටින්) --- */}
        <g fontSize="13" fontWeight="bold" fontFamily={fontStyle} fill="#15803d" textAnchor="middle">
          <text x="80" y="24">A</text>
          <text x="24" y="44">B</text>
          <text x="13" y="113">C</text>
          <text x="105" y="121">D</text>
          <text x="138" y="121">E</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (වෘත්තයක ස්පර්ශකය සහ අරය අතර සම්බන්ධය)
  // වෘත්තයක් මත වූ ලක්ෂ්‍යයකදී ඇඳි ස්පර්ශකය, එම ලක්ෂ්‍යය වෙත වූ අරයට ලම්භ වේ.
  if (id === 39) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="65" r="43" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- ඍජුකෝණ සංකේතය (Right Angle Marker - රතු පාටින්) --- */}
        <path d="M 75 98 L 83 98 L 83 108" fill="none" stroke="#dc2626" strokeWidth="1.5" />

        {/* --- වෘත්තයේ අරය OA (කොළ පාටින්) --- */}
        {/* කේන්ද්‍රය O(75, 65) සිට ස්පර්ශ ලක්ෂ්‍යය A(75, 108) දක්වා */}
        <line x1="75" y1="65" x2="75" y2="108" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />

        {/* --- ස්පර්ශක රේඛාව PQ (තද රෝස/මජෙන්ටා පාටින්) --- */}
        {/* (75, 108) ලක්ෂ්‍යය හරහා යන තිරස් රේඛාව */}
        <line x1="15" y1="108" x2="135" y2="108" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍රයේ ලක්ෂ්‍යය (O ලක්ෂ්‍යය සලකුණු කිරීම) --- */}
        <circle cx="75" cy="65" r="1.5" fill="#1e293b" />

        {/* --- ලක්ෂ්‍ය ලේබල් (O, A, P, Q - තද රතු පාටින්) --- */}
        <g fontSize="13" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c" textAnchor="middle">
          <text x="75" y="55">O</text>
          <text x="75" y="122">A</text>
          <text x="13" y="113">P</text>
          <text x="137" y="113">Q</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (වෘත්තයක ස්පර්ශකය සහ අරය අතර සම්බන්ධය)
  // වෘත්තයක් මත වූ ලක්ෂ්‍යයකදී ඇඳි ස්පර්ශකය, එම ලක්ෂ්‍යය වෙත වූ අරයට ලම්භ වේ.
  if (id === 40) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="65" r="43" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- ඍජුකෝණ සංකේතය (Right Angle Marker - රතු පාටින්) --- */}
        <path d="M 75 98 L 83 98 L 83 108" fill="none" stroke="#dc2626" strokeWidth="1.5" />

        {/* --- වෘත්තයේ අරය OA (කොළ පාටින්) --- */}
        {/* කේන්ද්‍රය O(75, 65) සිට ස්පර්ශ ලක්ෂ්‍යය A(75, 108) දක්වා */}
        <line x1="75" y1="65" x2="75" y2="108" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />

        {/* --- ස්පර්ශක රේඛාව PQ (තද රෝස/මජෙන්ටා පාටින්) --- */}
        {/* (75, 108) ලක්ෂ්‍යය හරහා යන තිරස් රේඛාව */}
        <line x1="15" y1="108" x2="135" y2="108" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

        {/* --- කේන්ද්‍රයේ ලක්ෂ්‍යය (O ලක්ෂ්‍යය සලකුණු කිරීම) --- */}
        <circle cx="75" cy="65" r="1.5" fill="#1e293b" />

        {/* --- ලක්ෂ්‍ය ලේබල් (O, A, P, Q - තද රතු පාටින්) --- */}
        <g fontSize="13" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c" textAnchor="middle">
          <text x="75" y="55">O</text>
          <text x="75" y="122">A</text>
          <text x="13" y="113">P</text>
          <text x="137" y="113">Q</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (බාහිර ලක්ෂ්‍යයක සිට ඇඳි ස්පර්ශක)
  if (id === 41) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (ලා නිල් පාටින්) --- */}
        <circle cx="105" cy="75" r="35" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- කෝණවල පසුබිම් වර්ණ (Filled Angles) --- */}
        {/* P කෝණය (රතු) - ඉහළ සහ පහළ */}
        <path d="M 15 75 L 28.82 69.17 A 15 15 0 0 1 28.82 80.83 Z" fill="#dc2626" />
        
        {/* O කෝණය (දම්) - ඉහළ සහ පහළ */}
        <path d="M 105 75 L 98.78 60.26 A 16 16 0 0 0 98.78 89.74 Z" fill="#7e22ce" />

        {/* --- කෝණවල චාප රේඛා (Angle Arcs) --- */}
        <path d="M 28.82 69.17 A 15 15 0 0 1 28.82 80.83" fill="none" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M 98.78 60.26 A 16 16 0 0 0 98.78 89.74" fill="none" stroke="#ec4899" strokeWidth="1.5" />

        {/* --- කේන්ද්‍රය සහ බාහිර ලක්ෂ්‍යය යා කරන රේඛාව (කහ/තැඹිලි පාටින්) --- */}
        <line x1="15" y1="75" x2="105" y2="75" stroke="#eab308" strokeWidth="1.5" />

        {/* --- ස්පර්ශක රේඛාවන් (කොළ පාටින්) --- */}
        {/* P(15, 75) සිට A(91.39, 42.76) දක්වා සහ B(91.39, 107.24) දක්වා */}
        <line x1="15" y1="75" x2="91.39" y2="42.76" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="75" x2="91.39" y2="107.24" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />

        {/* --- අරයන් (රෝස පාටින්) --- */}
        {/* O(105, 75) සිට A සහ B දක්වා */}
        <line x1="105" y1="75" x2="91.39" y2="42.76" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="75" x2="91.39" y2="107.24" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />

        {/* --- ලම්භක කෝණ සංකේත (Right Angles - කළු පාටින්) --- */}
        {/* A ලක්ෂ්‍යය අසල */}
        <path d="M 93.72 48.29 L 88.19 50.62 L 85.86 45.09" fill="none" stroke="#000000" strokeWidth="1.5" />
        {/* B ලක්ෂ්‍යය අසල */}
        <path d="M 93.72 101.71 L 88.19 99.38 L 85.86 104.91" fill="none" stroke="#000000" strokeWidth="1.5" />

        {/* --- කෝණ ඇතුළේ ඇති අකුරු (x, y - සුදු පාටින්) --- */}
        <g fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily={fontStyle} fill="" textAnchor="middle">
          <text x="35" y="72">x</text>
          <text x="35" y="82">x</text>
          <text x="96" y="70">y</text>
          <text x="96" y="86">y</text>
        </g>

        {/* --- ලක්ෂ්‍ය ලේබල් (P, A, B, O - තද රතු පාටින්) --- */}
        <g fontSize="14" fontWeight="bold" fontFamily={fontStyle} fill="#dc2626" textAnchor="middle">
          <text x="8" y="79.5">P</text>
          <text x="92" y="36">A</text>
          <text x="92" y="122">B</text>
          <text x="117" y="79.5">O</text>
        </g>

      </svg>
    );
  }
  // G11_ජ්‍යාමිතිය වෘත්ත ප්‍රමේයයන් (ඒකාන්තර වෘත්ත ඛණ්ඩ ප්‍රමේයය)
  // වෘත්තයකට ඇඳි ස්පර්ශකයක් සහ ස්පර්ශ ලක්ෂ්‍යයෙන් ඇඳි ජ්‍යායක් අතර කෝණය, ඒකාන්තර වෘත්ත ඛණ්ඩයේ කෝණයට සමාන වේ.
  if (id === 42) {
    return (
      <svg viewBox="0 0 150 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        
        {/* --- ප්‍රධාන වෘත්තය (ලා නිල් පාටින්) --- */}
        <circle cx="75" cy="65" r="45" fill="none" stroke="#00a3e0" strokeWidth="2" />

        {/* --- කෝණවල පසුබිම් වර්ණ (Filled Angles - රතු පාටින්) --- */}
        {/* B අභ්‍යන්තර කෝණය */}
        <path d="M 33 68.5 L 44 63.5 A 13 13 0 0 1 42.5 78.5 Z" fill="#dc2626" />
        
        {/* C ස්පර්ශක කෝණය (තිරස් ස්පර්ශකය සහ AC ජ්‍යාය අතර) */}
        {/* C ලක්ෂ්‍යය (75, 110) වේ. ACE කෝණය සලකුණු කිරීම */}
        <path d="M 75 110 L 89 110 A 14 14 0 0 0 79.5 96.5 Z" fill="#ef4444" fillOpacity="0.7" stroke="#00a3e0" strokeWidth="1" />

        {/* --- කෝණවල චාප රේඛා (Angle Arcs - සිහින් නිල්/කළු රේඛා) --- */}
        <path d="M 44 63.5 A 13 13 0 0 1 42.5 78.5" fill="none" stroke="#00a3e0" strokeWidth="1.5" />

        {/* --- ත්‍රිකෝණයේ පාද සහ ජ්‍යායන් (කොළ පාටින්) --- */}
        {/* ශීර්ෂයන්: A(90, 24), B(33, 68.5), C(75, 110) */}
        <path d="M 90 24 L 33 68.5 L 75 110 Z" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* --- ස්පර්ශක රේඛාව DE (දම් පාටින්) --- */}
        {/* (75, 110) ලක්ෂ්‍යය හරහා යන තිරස් ස්පර්ශකය */}
        <line x1="15" y1="110" x2="135" y2="110" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" />

        {/* --- ලක්ෂ්‍ය ලේබල් (A, B, C, D, E - තද රතු පාටින්) --- */}
        <g fontSize="13" fontWeight="bold" fontFamily={fontStyle} fill="#b91c1c" textAnchor="middle">
          <text x="94" y="18">A</text>
          <text x="21" y="72">B</text>
          <text x="75" y="124">C</text>
          <text x="13" y="115">D</text>
          <text x="137" y="115">E</text>
        </g>

      </svg>
    );
  }
  return null;
};