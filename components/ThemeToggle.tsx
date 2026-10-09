"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200 border border-slate-200 dark:border-slate-700 font-medium text-xs shadow-sm"
    >
      {isDarkMode ? (
        <>
          <span className="text-amber-400 text-base">☀️</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span className="text-indigo-400 text-base">🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}