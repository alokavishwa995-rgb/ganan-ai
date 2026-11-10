"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

 const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Theory", href: "/formulas", icon: "📖" },
    { name: "Auto Graph", href: "/grader", icon: "📊" },
    { name: "Account", href: "/login", icon: "👤" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pt-2 px-4 pointer-events-none">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl py-2 px-6 flex justify-around items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center transition-all ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive ? "bg-blue-100 dark:bg-blue-950/80" : ""
              }`}>
                <span className="text-xl block">{item.icon}</span>
              </div>
              <span className="text-[11px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}