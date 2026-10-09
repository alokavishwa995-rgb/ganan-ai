import Link from 'next/link';

// මෙන්න මේ Interface එකෙන් තමයි අපි Types මොනවද කියලා කියන්නේ
interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode; // Icon එක Emoji එකක් හෝ Component එකක් වෙන්න පුළුවන් නිසා
  link: string;
  isDarkMode?: boolean; // <-- අලුතින් එකතු කළා (Error එක නැති කරන්න)
}

export default function FeatureCard({ title, desc, icon, link, isDarkMode }: FeatureCardProps) {
  return (
    <Link href={link}>
      {/* Dark Mode එකට අදාළව Background එක සහ Border එක වෙනස් වෙනවා */}
      <div className={`px-4 py-6 rounded-[24px] shadow-[0_8px_24px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col items-center justify-center text-center cursor-pointer h-full border ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-50/50'
      }`}>
        
        {/* Icon එක */}
        <div className="text-[55px] mb-3 leading-none drop-shadow-sm">
          {icon}
        </div>
        
        {/* Title & Description - Dark Mode එකට අදාළව Text Color එක වෙනස් වෙනවා */}
        <h3 className={`text-[15px] font-bold mb-1.5 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h3>
        <p className={`text-[11px] font-medium px-1 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {desc}
        </p>
        
      </div>
    </Link>
  );
}