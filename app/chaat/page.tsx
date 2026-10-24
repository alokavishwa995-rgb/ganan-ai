"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import UpgradeModal from "@/components/UpgradeModal";
import { db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  svgDiagram?: string; // 🎯 Diagram එක වෙනම Save කිරීමට
}

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isProUser, setIsProUser] = useState(false); 
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🎯 1. Phone එකේ LocalStorage එකෙන් සහ Server එකෙන් History Load කිරීම
  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem("userEmail");
    
    if (!email) {
      router.push("/");
      return;
    }
    
    const cleanEmail = email.toLowerCase();
    setUserEmail(cleanEmail);

    const storageKey = `gmath_chat_history_${cleanEmail}`;

    // 📱 A. ළමයාගේ Phone එකේ LocalStorage එකෙන් මුලින්ම Instant Load කිරීම
    const localSaved = localStorage.getItem(storageKey);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Local Storage Parse Error:", e);
      }
    }

    // 👑 B. Live Firestore Database එකෙන් User PRO ද යන්න පරීක්ෂා කිරීම
    const checkLiveUserStatus = async () => {
      try {
        const userRef = doc(db, "users", cleanEmail);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isPaid === true || userData.plan === "pro") {
            setIsProUser(true);
          }
        }
      } catch (err) {
        console.error("Live Status Check Error:", err);
      }
    };

    // ☁️ C. Server එකෙන් Chat History එක ලබාගෙන Diagram එකත් සමඟ Sync කිරීම
    const fetchServerHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const res = await fetch(`/api/chaat?userEmail=${encodeURIComponent(cleanEmail)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          const serverMsgs: Message[] = data.messages.map((m: any, idx: number) => ({
            id: idx.toString(),
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
            svgDiagram: m.svgDiagram || "", // 🎯 Database එකෙන් SVG Diagram එක එකතු කිරීම
          }));
          setMessages(serverMsgs);
          // 📱 Phone එකේ LocalStorage එකත් Sync කිරීම
          localStorage.setItem(storageKey, JSON.stringify(serverMsgs));
        }
      } catch (err) {
        console.error("History Fetch Error:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    checkLiveUserStatus();
    fetchServerHistory();

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("status") === "success") {
        alert("ගෙවීම් සාර්ථකයි! ඔබගේ Pro සාමාජිකත්වය සක්‍රීය විය. 🌟");
        window.history.replaceState({}, document.title, window.location.pathname);
        checkLiveUserStatus(); 
      }
    }
  }, [router]);

  // 📱 2. Message එකක් වෙනස් වන සෑම විටම ළමයාගේ Phone එකේ Auto Save වීම
  useEffect(() => {
    if (userEmail && messages.length > 0) {
      const storageKey = `gmath_chat_history_${userEmail.toLowerCase()}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, userEmail]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 🎯 SVG Extract කිරීම සහ KaTeX Unicode \u200D Warning එක Fix කිරීම
  const extractSvgAndContent = (rawText: string, existingSvg?: string) => {
    const svgMatch = rawText.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/);
    const extractedSvg = svgMatch ? svgMatch[1] : "";
    const svgDiagram = extractedSvg || existingSvg || "";
    let cleanContent = rawText.replace(/\[\[SVG:[\s\S]*?\]\]/g, "").trim();

    // KaTeX Math සූත්‍ර ඇතුළතින් Zero-Width Joiner (\u200D) ඉවත් කිරීම (Console Warnings වැලැක්වීමට)
    cleanContent = cleanContent.replace(/(\$\$[\s\S]*?\$\$|\$[^\$]+\$)/g, (match) =>
      match.replace(/\u200D/g, "")
    );

    return { cleanContent, svgDiagram };
  };

  // 🗑️ History එක සම්පූර්ණයෙන්ම මකා දැමීම (State + LocalStorage)
  const handleClearHistory = () => {
    setMessages([]);
    if (userEmail) {
      const storageKey = `gmath_chat_history_${userEmail.toLowerCase()}`;
      localStorage.removeItem(storageKey);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !userEmail) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chaat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userEmail,
          isPro: isProUser,
        }),
      });

      if (res.status === 429) {
        if (!isProUser) {
          setShowUpgradeModal(true);
        }
        setIsLoading(false);
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error("Failed to stream response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "", svgDiagram: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        const { cleanContent, svgDiagram } = extractSvgAndContent(aiText);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, content: cleanContent, svgDiagram }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient || !userEmail) {
    return <div className="h-screen bg-slate-50"></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-indigo-50 font-sans relative">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-indigo-100 p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <Link href="/" className="text-indigo-500 hover:text-indigo-700 flex items-center gap-2 font-medium transition">
          <span className="text-xl">🔙</span> මුල් පිටුවට
        </Link>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🏫</span>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ගණිත මිතුරා
            </h1>
            {isProUser && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                PRO 👑
              </span>
            )}
          </div>
          <p className="text-[11px] font-semibold text-indigo-500 mt-0.5">
            👤 {userEmail}
          </p>
        </div>
        
        {messages.length > 0 ? (
          <button
            onClick={handleClearHistory}
            className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-3 py-1.5 rounded-xl border border-rose-200 transition"
          >
            History මකන්න 🗑️
          </button>
        ) : (
          <div className="w-20"></div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {isHistoryLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-indigo-500 font-medium animate-pulse">
            සංවාද සටහන් Load වෙමින් පවතී... ⌛
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
              ආයුබෝවන් යාලුවා! 🌟 මම ඔයාගේ 'ගණිත මිතුරා'. ගණිතය කියන්නේ ගේම් එකක් වගේ හරිම විනෝදජනක දෙයක්. ඔයාට අමාරු ඕනෑම තැනක් මගෙන් අහන්න. අපි එකතුවෙලා ලේසියෙන්ම විසඳමු! 💪
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const { cleanContent, svgDiagram } = extractSvgAndContent(msg.content, msg.svgDiagram);

            return (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg shadow-sm mb-1 flex-shrink-0">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 text-[15px] leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl rounded-br-sm"
                      : "bg-white text-slate-800 rounded-3xl rounded-bl-sm border border-indigo-50"
                  }`}
                >
                  <div className="prose prose-slate max-w-none font-medium opacity-90">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {cleanContent}
                    </ReactMarkdown>
                  </div>

                  {/* 🎯 SVG Diagram එක 100% නිවැරදිව Render වීම */}
                  {svgDiagram && (
                    <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-indigo-100 flex justify-center items-center shadow-inner overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: svgDiagram }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg shadow-sm mb-1">
              🤔
            </div>
            <div className="bg-white p-4 rounded-3xl rounded-bl-sm border border-indigo-50 shadow-sm flex items-center gap-2 text-indigo-500 font-medium text-sm">
              ගණිත මිතුරා කල්පනා කරමින් සිටී
              <div className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-gradient-to-t from-white via-white to-transparent pb-6">
        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-white p-2 rounded-full border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="බය නැතුව ඕනෑම ප්‍රශ්නයක් අහන්න... ✍️"
            className="flex-1 px-4 py-3 bg-transparent text-[15px] focus:outline-none text-slate-700 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md mr-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
        </p>
      </form>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        userEmail={userEmail}
      />

    </div>
  );
}