"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // 🚫 Chat පිටුවේදී සහ Photo Scanner පිටුවේදී BottomNav එක Hide කරයි
  if (pathname === "/chaat" || pathname === "/scanner") {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Theory", href: "/formulas", icon: "📖" },
    { name: "Auto Graph", href: "/grader", icon: "📊" },
    { name: "Account", href: "/login", icon: "👤" },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="w-full max-w-sm sm:max-w-md bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] py-2 px-5 flex justify-around items-center pointer-events-auto transition-all">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                isActive
                  ? "text-blue-400 font-bold scale-105"
                  : "text-slate-400 hover:text-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-1.5 rounded-2xl transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30" 
                  : "hover:bg-slate-800/50"
              }`}>
                <span className="text-base block">{item.icon}</span>
              </div>
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}