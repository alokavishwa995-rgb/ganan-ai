"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // User Log in වී නැත්නම් සහ දැනට ඉන්නේ /login Page එකේ නෙවෙයි නම් /login එකට Redirect කිරීම
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  // Auth Status එක Check වෙන අතරතුර Loading Spinner එකක් පෙන්වීම
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Login නොවී වෙනත් Page එකක සිටී නම් කිසිවක් Render නොකිරීම (Redirect වන තෙක්)
  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}