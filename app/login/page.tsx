"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { auth, googleProvider, db } from "@/lib/firebase";
import { 
  signInWithPopup, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [userProfile, setUserProfile] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const displayNameFromEmail = (emailStr: string) => {
    if (!emailStr) return "මිතුරා";
    const parts = emailStr.split("@")[0];
    return parts.charAt(0).toUpperCase() + parts.slice(1);
  };

  // 🔄 Profile Photo වෙනස් කිරීමේ Handler (Base64 + LocalStorage + Firestore Sync)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("ඡායාරූපයේ ප්‍රමාණය 2MB ට වඩා අඩු විය යුතුය.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result as string;
      localStorage.setItem("userPhoto", base64Photo);

      setUserProfile((prev: any) => ({
        ...prev,
        photoURL: base64Photo
      }));

      if (userProfile?.email) {
        try {
          const userRef = doc(db, "users", userProfile.email.toLowerCase());
          await setDoc(userRef, { photoURL: base64Photo }, { merge: true });
        } catch (err) {
          console.error("Firestore photo update error:", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // 🔄 User Log වී ඇත්දැයි පරීක්ෂා කිරීම
  useEffect(() => {
    let isMounted = true;

    const loadUserFromDB = async () => {
      const localEmail = localStorage.getItem("userEmail");
      const localName = localStorage.getItem("userName");
      const localPhoto = localStorage.getItem("userPhoto");

      if (localEmail) {
        setUserProfile({
          email: localEmail,
          name: localName || displayNameFromEmail(localEmail),
          photoURL: localPhoto || null,
          plan: "free",
          isPaid: false
        });

        try {
          const userRef = doc(db, "users", localEmail.toLowerCase());
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && isMounted) {
            const dbData = userSnap.data();
            const finalPhoto = dbData.photoURL || localPhoto || null;
            if (dbData.photoURL) localStorage.setItem("userPhoto", dbData.photoURL);

            setUserProfile({
              email: localEmail,
              name: dbData.name || localName || displayNameFromEmail(localEmail),
              photoURL: finalPhoto,
              plan: dbData.plan || "free",
              isPaid: dbData.isPaid || false,
            });
          }
        } catch (err) {
          console.error("Firestore DB fetch error:", err);
        }
        if (isMounted) setCheckingAuth(false);
      } else {
        if (isMounted) setCheckingAuth(false);
      }
    };

    loadUserFromDB();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        const uEmail = currentUser.email.toLowerCase();
        let uName = currentUser.displayName || uEmail.split("@")[0];
        let uPhoto = currentUser.photoURL || localStorage.getItem("userPhoto");

        let userData: any = {
          email: uEmail,
          name: uName,
          photoURL: uPhoto,
          plan: "free",
          isPaid: false
        };

        try {
          const userRef = doc(db, "users", uEmail);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            userData = { ...userData, ...userSnap.data() };
            if (userData.name) uName = userData.name;
            if (userData.photoURL) uPhoto = userData.photoURL;
          }
        } catch (err) {
          console.warn("Firestore fetch error in onAuthStateChanged:", err);
        }

        localStorage.setItem("userEmail", uEmail);
        localStorage.setItem("userName", uName);
        if (uPhoto) localStorage.setItem("userPhoto", uPhoto);

        if (isMounted) {
          setUserProfile(userData);
          setCheckingAuth(false);
        }
      } else if (!localStorage.getItem("userEmail")) {
        if (isMounted) setUserProfile(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const initializeUserProfile = async (userEmail: string, displayName?: string | null, photoURL?: string | null) => {
    const finalName = displayName || displayNameFromEmail(userEmail);

    try {
      const userRef = doc(db, "users", userEmail);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const today = new Date().toISOString().split("T")[0];
        const currentMonth = new Date().toISOString().substring(0, 7);

        await setDoc(userRef, {
          email: userEmail,
          name: finalName,
          photoURL: photoURL || null,
          plan: "free",
          isPaid: false,
          isVerified: true,
          createdAt: new Date().toISOString(),
          dailyUsage: {
            askQuestions: 0,
            photoScan: 0,
            lastResetDate: today,
          },
          monthlyUsage: {
            paperGen: 0,
            lastResetMonth: currentMonth,
          },
        }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore initializeUserProfile error:", err);
    }

    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userName", finalName);
    if (photoURL) localStorage.setItem("userPhoto", photoURL);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userEmail = res.user.email?.toLowerCase();
      const googleName = res.user.displayName || displayNameFromEmail(userEmail || "");
      const googlePhoto = res.user.photoURL || null;

      if (userEmail) {
        await initializeUserProfile(userEmail, googleName, googlePhoto);
        setUserProfile({
          email: userEmail,
          name: googleName,
          photoURL: googlePhoto,
          plan: "free",
          isPaid: false
        });
        router.push("/");
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google Sign-In Window එක වැසූ නිසා ඇතුළු වීම අවලංගු විය.");
      } else {
        setErrorMsg("Google මගින් ඇතුළු වීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: cleanEmail, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setSuccessMsg("Verification OTP කේතය ඔබගේ Email එකට යවන ලදී. කරුණාකර එය ඇතුළත් කරන්න.");
        setShowOtpStep(true);
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.message?.includes("Verify")) {
            setShowOtpStep(true);
          }
          throw new Error(data.message);
        }

        const uName = data.user?.name || displayNameFromEmail(cleanEmail);
        const uPhoto = data.user?.photoURL || localStorage.getItem("userPhoto");

        localStorage.setItem("userEmail", cleanEmail);
        localStorage.setItem("userName", uName);
        if (uPhoto) localStorage.setItem("userPhoto", uPhoto);
        
        setUserProfile({
          email: cleanEmail,
          name: uName,
          photoURL: uPhoto,
          plan: data.user?.plan || "free",
          isPaid: data.user?.isPaid || false
        });

        setSuccessMsg("සාර්ථකව ඇතුළු විය!");
        setTimeout(() => {
          router.push("/");
        }, 300);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "ඇතුළු වීමට නොහැකි විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const uName = name.trim() || displayNameFromEmail(cleanEmail);
      localStorage.setItem("userEmail", cleanEmail);
      localStorage.setItem("userName", uName);
      
      setUserProfile({
        email: cleanEmail,
        name: uName,
        plan: "free",
        isPaid: false
      });

      setSuccessMsg("ගිණුම සාර්ථකව තහවුරු විය!");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || "OTP එක තහවුරු කිරීම අසාර්ථක විය.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("කරුණාකර ඔබගේ Email ලිපිනය ඇතුළත් කරන්න.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSuccessMsg("මුරපදය වෙනස් කිරීමේ Link එක ඔබගේ Email එකට යවන ලදී. Inbox එක පරික්ෂා කරන්න.");
    } catch (err: any) {
      setErrorMsg("Email එක යැවීමට නොහැකි විය. Email ලිපිනය නිවැරදිදැයි බලන්න.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhoto");
      setUserProfile(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse font-medium text-slate-400 text-sm">තොරතුරු පරීක්ෂා කරමින් පවතී...</p>
        </div>
      </div>
    );
  }

  // 👤 LOGGED IN VIEW (Responsive & Photo Upload)
  if (userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 p-4 sm:p-8 font-sans">
        <div className="bg-white p-6 sm:p-9 rounded-[32px] shadow-2xl w-full max-w-md sm:max-w-lg border border-slate-100 text-center relative overflow-hidden transition-all">
          
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Interactive Profile Photo Avatar with Upload Icon */}
          <div className="relative w-24 h-24 mx-auto mb-3 group cursor-pointer" title="ඡායාරූපය වෙනස් කිරීමට එක පාරක් Click කරන්න">
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="w-24 h-24 rounded-full overflow-hidden mx-auto shadow-md border-2 border-emerald-400 flex items-center justify-center bg-gradient-to-tr from-emerald-100 to-teal-100 transition-transform group-hover:scale-105"
            >
              {userProfile.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-emerald-600">👤</span>
              )}
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform group-hover:scale-110"
              title="ඡායාරූපය වෙනස් කරන්න"
            >
              <span className="text-xs block">📷</span>
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {userProfile.name}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5 mb-5">{userProfile.email}</p>

          {/* Subscription Status Card */}
          <div className="bg-slate-50/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-left space-y-3 mb-6 shadow-sm">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold">ගිණුම් වර්ගය (Plan):</span>
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 font-extrabold text-[11px] sm:text-xs rounded-full uppercase tracking-wider border border-emerald-500/20">
                {userProfile.plan || "Free"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold">තත්ත්වය:</span>
              <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                {userProfile.isPaid ? (
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">🟢 සක්‍රීයයි (Paid)</span>
                ) : (
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">🔵 නොමිලේ (Free User)</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>🏠</span> මුල් පිටුවට (Home Page)
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-200/80 p-3 sm:p-3.5 rounded-2xl font-bold active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>🚪</span> ගිණුමෙන් නික්මෙන්න (Logout)
            </button>
          </div>

          {/* PayHere Compliance Legal Links */}
          <div className="pt-4 border-t border-slate-100 flex justify-center gap-3 text-[11px] sm:text-xs font-semibold text-slate-400">
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-emerald-600 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-emerald-600 transition-colors">
              Refund Policy
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 🔐 LOGIN / SIGNUP / OTP FORM VIEW
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 p-4 sm:p-8 font-sans">
      <div className="bg-white p-6 sm:p-9 rounded-[32px] shadow-2xl w-full max-w-md sm:max-w-lg border border-slate-100 relative overflow-hidden transition-all">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl font-extrabold shadow-lg shadow-emerald-500/20">
            📐
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {showOtpStep
              ? "Email එක Verify කරන්න ✉️"
              : isResetMode
              ? "මුරපදය නැවත සකසන්න"
              : isSignUp
              ? "නව ගිණුමක් තනන්න"
              : "ගණිත මිතුරා AI"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            {showOtpStep
              ? `${email} වෙත යැවූ ඉලක්කම් 6ක OTP අංකය ඇතුළත් කරන්න`
              : isResetMode
              ? "ඔබගේ Email ලිපිනය ඇතුළත් කරන්න"
              : isSignUp
              ? "ඔබගේ විස්තර ඇතුළත් කර ලියාපදිංචි වන්න"
              : "ගණිත ප්‍රශ්න විසඳා ගැනීමට ඇතුළු වන්න"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm rounded-2xl text-center font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs sm:text-sm rounded-2xl text-center font-semibold">
            ✅ {successMsg}
          </div>
        )}

        {/* OTP Input Form Step */}
        {showOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-2">
                OTP කේතය (Digits 6)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[10px] text-2xl font-mono p-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm mt-2"
            >
              {loading ? "තහවුරු කරමින්..." : "ගිණුම සක්‍රිය කරන්න ✔"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpStep(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-xs sm:text-sm text-slate-500 hover:underline mt-2 block mx-auto font-medium"
            >
              ⬅️ ආපසු Form එකට
            </button>
          </form>
        ) : (
          /* Main Login / Register / Reset Form */
          <>
            {!isResetMode && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-bold p-3.5 sm:p-4 rounded-2xl mb-5 flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 text-xs sm:text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google මගින් ඇතුළු වන්න</span>
                </button>

                <div className="relative flex py-2 items-center mb-5">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-xs sm:text-sm font-medium">නැතහොත්</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </>
            )}

            <form onSubmit={isResetMode ? handleResetPassword : handleEmailAuth} className="space-y-4">
              
              {isSignUp && !isResetMode && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1 text-left">
                    ඔබගේ සම්පූර්ණ නම (Name)
                  </label>
                  <input
                    type="text"
                    placeholder="උදා: vishwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3.5 sm:p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1 text-left">
                  Email ලිපිනය
                </label>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 sm:p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 bg-slate-50/50"
                />
              </div>

              {!isResetMode && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-600 text-left">
                      මුරපදය (Password)
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(true);
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-xs sm:text-sm text-emerald-600 hover:underline font-semibold"
                      >
                        මුරපදය අමතක වුනාද?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3.5 sm:p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 bg-slate-50/50"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm mt-2"
              >
                {loading ? (
                  <span>සකසමින් පවතී...</span>
                ) : isResetMode ? (
                  "Reset Link එක යවන්න"
                ) : isSignUp ? (
                  "ලියාපදිංචි වන්න"
                ) : (
                  "ඇතුළු වන්න"
                )}
              </button>
            </form>

            <div className="mt-6 text-xs sm:text-sm text-center space-y-2">
              {isResetMode ? (
                <p
                  onClick={() => {
                    setIsResetMode(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-emerald-600 font-bold cursor-pointer hover:underline"
                >
                  ⬅️ ආපසු Login එකට
                </p>
              ) : (
                <p
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-slate-500 font-medium"
                >
                  {isSignUp ? "දැනටමත් ගිණුමක් තිබේද? " : "නව ගිණුමක් අවශ්‍යද? "}
                  <span className="text-emerald-600 font-bold cursor-pointer hover:underline">
                    {isSignUp ? "ඇතුළු වන්න" : "ලියාපදිංචි වන්න"}
                  </span>
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}