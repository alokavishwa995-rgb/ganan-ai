"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import UpgradeModal from "@/components/UpgradeModal";
import { useLocalChat } from "@/hooks/useLocalChat";

export default function ChatPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 Local Storage Cache Hook එක (Phone එකේ Save කරගැනීම සඳහා)
  const { messages, addMessage, clearHistory, isLoaded } = useLocalChat("gmath_chat_history");

  // Daily Limit එක පිරුණු විට පෙන්වන Modal එක
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Logged-in User Check & Default Welcome Message එක එකතු කිරීම
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/login");
      return;
    }

    setUserEmail(email);

    // පළමු වතාවට එන විට Welcome Message එක Local Storage එකට එකතු කිරීම
    if (isLoaded && messages.length === 0) {
      addMessage({
        sender: "ai",
        text: "ආයුබෝවන් යාලුවා! 🌟 මම ඔයාගේ 'ගණිත මිතුරා'. ගණිතය කියන්නේ ගේම් එකක් වගේ හරිම විනෝදජනක දෙයක්. ඔයාට අමාරු ඕනෑම තැනක් මගෙන් අහන්න. අපි එකතුවෙලා ලේසියෙන්ම විසඳමු! 💪",
      });
    }
  }, [router, isLoaded, messages.length, addMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // SVG රූපසටහන් වෙන් කර ගැනීමේ Helper Function එක
  const extractSvgAndContent = (rawText: string) => {
    const svgMatch = rawText.match(/\[\[SVG:\s*(<svg[\s\S]*?<\/svg>)\s*\]\]/);
    const svgDiagram = svgMatch ? svgMatch[1] : "";
    const cleanContent = rawText.replace(/\[\[SVG:[\s\S]*?\]\]/g, "").trim();
    return { cleanContent, svgDiagram };
  };

  // Chat Message එක යැවීම සහ Local Storage එකේ Save කිරීම
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // 1. User Message එක කෙළින්ම Phone එකේ Local Storage එකේ Save කිරීම
    addMessage({
      sender: "user",
      text: query,
    });

    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Backend API එකට යැවීමට Message History එක සකස් කිරීම
      const formattedMessages = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
      formattedMessages.push({ role: "user", content: query });

      const res = await fetch("/api/chaat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages, userEmail }),
      });

      // 🛑 Limit එක පිරී ඇත්නම් Modal එක පෙන්වීම
      if (res.status === 429) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Network response failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
      }

      const { cleanContent, svgDiagram } = extractSvgAndContent(accumulatedText);

      // 2. AI උත්තරය සම්පූර්ණයෙන් ලැබුණු පසු Phone එකේ Local Storage එකට Save කිරීම
      addMessage({
        sender: "ai",
        text: cleanContent,
        imageUrl: svgDiagram ? `data:image/svg+xml;utf8,${encodeURIComponent(svgDiagram)}` : undefined,
      });

    } catch (err) {
      console.error("Streaming error:", err);
      addMessage({
        sender: "ai",
        text: "අයියෝ! පොඩි දෝෂයක් ආවා. ටිකකින් ආයෙත් අහන්නකෝ! 😥",
      });
    } finally {
      setLoading(false);
    }
  };

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
          </div>
          {userEmail && (
            <p className="text-[11px] font-semibold text-indigo-500 mt-0.5">
              👤 {userEmail}
            </p>
          )}
        </div>
        
        {/* History මකන Button එක */}
        {messages.length > 0 ? (
          <button
            onClick={clearHistory}
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
        {!isLoaded ? (
          <div className="flex justify-center items-center h-full text-indigo-500 font-medium animate-pulse">
            සංවාද සටහන් Phone එකෙන් Load වෙමින් පවතී... ⌛
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
              
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg shadow-sm mb-1 flex-shrink-0">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 text-[15px] leading-relaxed shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl rounded-br-sm"
                    : "bg-white text-slate-800 rounded-3xl rounded-bl-sm border border-indigo-50"
                }`}
              >
                {/* ReactMarkdown + KaTeX Math Formatting */}
                <div className="prose prose-slate max-w-none font-medium opacity-90">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {/* SVG රූපසටහන තිබේ නම් පෙන්වීම */}
                {msg.imageUrl && msg.imageUrl.startsWith("data:image/svg+xml") && (
                  <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-indigo-100 flex justify-center items-center shadow-inner overflow-hidden">
                    <img src={msg.imageUrl} alt="Math Diagram" className="max-w-full h-auto" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
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
      <div className="p-4 bg-gradient-to-t from-white via-white to-transparent pb-6">
        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-white p-2 rounded-full border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="බය නැතුව ඕනෑම ප්‍රශ්නයක් අහන්න... ✍️"
            className="flex-1 px-4 py-3 bg-transparent text-[15px] focus:outline-none text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md mr-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
          ගණිත මිතුරා හට වැරදීම් සිදුවිය හැක. වැදගත් තොරතුරු නැවත පරීක්ෂා කරන්න.
        </p>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        userEmail={userEmail}
      />

    </div>
  );
}