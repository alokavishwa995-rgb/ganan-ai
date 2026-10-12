"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Google Redirect එකෙන් නැවත පැමිණෙන විට Result එක ලබා ගැනීම
    getRedirectResult(auth).catch((error) => {
      console.error("Google Redirect Error: ", error);
    });

    // 2. Auth State වෙනස්වීම් පරීක්ෂා කිරීම
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        // PayHere Checkout එකට අවශ්‍ය User Email එක LocalStorage හි තැන්පත් කිරීම
        localStorage.setItem("userEmail", currentUser.email);

        // Firestore හි User Data සේව් කිරීම
        await setDoc(doc(db, "users", currentUser.email), {
          uid: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          lastLogin: serverTimestamp(),
        }, { merge: true });
      } else {
        localStorage.removeItem("userEmail");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Popup වෙනුවට Redirect ක්‍රමය භාවිතය (COOP සහ Mobile Errors මඟහරවා ගැනීමට)
  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);