"use client";

import { useState, useEffect } from "react";
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

  const router = useRouter();

  const displayNameFromEmail = (emailStr: string) => {
    if (!emailStr) return "මිතුරා";
    const parts = emailStr.split("@")[0];
    return parts.charAt(0).toUpperCase() + parts.slice(1);
  };

  // 🔄 User Log වී ඇත්දැයි පරීක්ෂා කිරීම (Database එකෙන් අලුත්ම තොරතුරු ගැනීම)
  useEffect(() => {
    let isMounted = true;

    const loadUserFromDB = async () => {
      const localEmail = localStorage.getItem("userEmail");
      const localName = localStorage.getItem("userName");

      if (localEmail) {
        // තාවකාලිකව Local Storage එකෙන් පෙන්වීම (UI එක ඉක්මනින් Load වීමට)
        setUserProfile({
          email: localEmail,
          name: localName || displayNameFromEmail(localEmail),
          plan: "free",
          isPaid: false
        });

        // 🎯 කෙළින්ම Database එකෙන් අලුත්ම Plan එක සහ තත්ත්වය ගැනීම
        try {
          const userRef = doc(db, "users", localEmail.toLowerCase());
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && isMounted) {
            const dbData = userSnap.data();
            setUserProfile({
              email: localEmail,
              name: dbData.name || localName || displayNameFromEmail(localEmail),
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

    // Firebase Google Login සඳහා Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        const uEmail = currentUser.email.toLowerCase();
        let uName = currentUser.displayName || uEmail.split("@")[0];
        let userData: any = {
          email: uEmail,
          name: uName,
          plan: "free",
          isPaid: false
        };

        try {
          const userRef = doc(db, "users", uEmail);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            userData = { ...userData, ...userSnap.data() };
            if (userData.name) uName = userData.name;
          }
        } catch (err) {
          console.warn("Firestore fetch error in onAuthStateChanged:", err);
        }

        localStorage.setItem("userEmail", uEmail);
        localStorage.setItem("userName", uName);

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

  // 🎯 DB Profile එක සෑදීම (Google Login සඳහා)
  const initializeUserProfile = async (userEmail: string, displayName?: string | null) => {
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
  };

  // 🌐 Google Sign-In
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userEmail = res.user.email?.toLowerCase();
      const googleName = res.user.displayName || displayNameFromEmail(userEmail || "");

      if (userEmail) {
        await initializeUserProfile(userEmail, googleName);
        setUserProfile({
          email: userEmail,
          name: googleName,
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

  // ✉️ Email / Password Custom Auth (Register / Login)
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
        localStorage.setItem("userEmail", cleanEmail);
        localStorage.setItem("userName", uName);
        
        setUserProfile({
          email: cleanEmail,
          name: uName,
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

  // 🔑 OTP Verify කිරීමේ Handler
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

  // 🔑 Password Reset
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

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      setUserProfile(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <p className="animate-pulse font-medium">තොරතුරු පරීක්ෂා කරමින් පවතී...</p>
      </div>
    );
  }

  // 👤 LOGGED IN VIEW
  if (userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 text-center">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner border-2 border-emerald-200">
            👤
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            {userProfile.name}
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">{userProfile.email}</p>

          <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">ගිණුම් වර්ගය (Plan):</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full uppercase">
                {userProfile.plan || "Free"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">තත්ත්වය:</span>
              <span className="text-slate-700 font-semibold text-xs">
                {userProfile.isPaid ? "🟢 සක්‍රීයයි (Paid)" : "🔵 නොමිලේ (Free User)"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold shadow-md transition duration-200 text-sm"
            >
              🏠 මුල් පිටුවට (Home Page)
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 p-3 rounded-xl font-semibold transition duration-200 text-sm"
            >
              🚪 ගිණුමෙන් නික්මෙන්න (Logout)
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 🔐 LOGIN / SIGNUP / OTP FORM VIEW
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl font-extrabold shadow-inner">
            📐
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {showOtpStep
              ? "Email එක Verify කරන්න ✉️"
              : isResetMode
              ? "මුරපදය නැවත සකසන්න"
              : isSignUp
              ? "නව ගිණුමක් තනන්න"
              : "ගණිත මිතුරා AI"}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
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
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center font-medium">
            ✅ {successMsg}
          </div>
        )}

        {/* OTP Input Form Step */}
        {showOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                OTP කේතය (Digits 6)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[10px] text-2xl font-mono p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold shadow-md transition duration-200 disabled:opacity-50 text-sm mt-2"
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
              className="text-xs text-slate-500 hover:underline mt-2 block mx-auto"
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
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold p-3.5 rounded-xl mb-5 flex items-center justify-center gap-3 transition shadow-sm disabled:opacity-50"
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
                  <span className="flex-shrink mx-4 text-slate-400 text-xs">නැතහොත්</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </>
            )}

            <form onSubmit={isResetMode ? handleResetPassword : handleEmailAuth} className="space-y-4">
              
              {isSignUp && !isResetMode && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">
                    ඔබගේ සම්පූර්ණ නම (Name)
                  </label>
                  <input
                    type="text"
                    placeholder="උදා: vishwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition text-sm text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">
                  Email ලිපිනය
                </label>
                <input
                  type="email"
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition text-sm text-slate-800"
                />
              </div>

              {!isResetMode && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-600 text-left">
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
                        className="text-xs text-emerald-600 hover:underline"
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
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition text-sm text-slate-800"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold shadow-md transition duration-200 disabled:opacity-50 text-sm mt-2"
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

            <div className="mt-6 text-xs text-center space-y-2">
              {isResetMode ? (
                <p
                  onClick={() => {
                    setIsResetMode(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-emerald-600 font-semibold cursor-pointer hover:underline"
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
                  className="text-slate-600"
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