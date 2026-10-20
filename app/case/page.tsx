import MathMafia from '@/components/MathMafia'; // ඔයා component එක සේව් කරපු තැනට path එක හදාගන්න
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white font-sans p-4 md:p-8">
      
      {/* ප්‍රධාන Header එක */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-4 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 tracking-tighter">
            GANAN AI <span className="text-slate-500 text-2xl tracking-normal">| Math Mafia</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide">
            සාමාන්‍ය පෙළ ගණිතය අභිරහස් විසඳීමක් බවට පත් කරමු!
          </p>
        </div>
        
        {/* ඔයාගේ ළමයාගේ Profile / Login බට්න් එන්න ඕනේ මෙතනට */}
        <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full text-sm font-bold text-slate-300">
          👤 User123 (Logged In)
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* වම් පැත්ත: ප්‍රධාන Game එක (ඉඩ වැඩිපුර ගන්නවා - 8 columns) */}
        <div className="xl:col-span-8 w-full">
          {/* මෙතන userId එක දැනට hardcode කරලා තියෙන්නේ. පස්සේ ඔයාගේ Auth system (Firebase Auth) එකෙන් එන ID එක මෙතනට පාස් කරන්න */}
          <MathMafia userId="test_user_123" />
        </div>

        {/* දකුණු පැත්ත: Leaderboard එක (ඉඩ අඩුවෙන් ගන්නවා - 4 columns) */}
        <div className="xl:col-span-4 w-full sticky top-8">
          <Leaderboard />
          
          {/* පොඩි අමතර Vibe එකක් දෙන්න දාපු Instructions කෑල්ලක් */}
          <div className="mt-6 bg-slate-900/50 border border-slate-800 p-5 rounded-lg">
            <h3 className="text-red-500 font-bold mb-2 uppercase text-sm tracking-widest">පරීක්ෂක උපදෙස්:</h3>
            <ul className="text-slate-400 text-sm space-y-2 list-disc pl-4">
              <li>හැම නඩුවකම ඉන්නේ එක බොරුකාරයයි.</li>
              <li>කැල්කියුලේටරයක් පාවිච්චි කිරීමට අවසර ඇත.</li>
              <li>වැරදි සැකකරුවෙකු තේරුවහොත් නියම අපරාධකරු පලා යනු ඇත.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 text-center text-slate-600 border-t border-slate-900 pt-8 pb-4 text-sm font-medium">
        © {new Date().getFullYear()} Ganan AI - Developed in Sri Lanka 🇱🇰
      </footer>
      
    </main>
  );
}