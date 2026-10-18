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

const parseAIResponse = (fullText: string) => {
  const svgRegex = /<svg[\s\S]*?<\/svg>/;
  const match = fullText.match(svgRegex);
  
  if (match) {
    const svgCode = match[0];
    const plainText = fullText.replace(svgRegex, "").trim(); 
    return { text: plainText, svg: svgCode };
  }
  
  return { text: fullText, svg: null };
};

export default function ScannerPage() {
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { messages, addMessage, clearHistory } = useLocalChat("gmath_scanner_history");

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem("userEmail");
    
    if (!email) {
      router.push("/");
      return;
    }
    
    setUserEmail(email);

    let streamInstance: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        streamInstance = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error: ", err);
      }
    };

    startCamera();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [router]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImgSrc(canvas.toDataURL("image/jpeg"));
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToAI = async () => {
    if (!imgSrc || !userEmail) return;
    setLoading(true);
    setSvgCode(null);
    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        body: JSON.stringify({ image: imgSrc, userEmail }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 429) {
        setShowUpgradeModal(true);
        return;
      }

      const data = await res.json();
      
      const rawText = data.text || data.solution;
      if (rawText) {
        const parsed = parseAIResponse(rawText);
        setSolution(parsed.text);
        setSvgCode(parsed.svg);

        addMessage({
          sender: "ai",
          text: parsed.text,
          imageUrl: parsed.svg ? `data:image/svg+xml;utf8,${encodeURIComponent(parsed.svg)}` : imgSrc,
        });

      } else {
        const errorMsg = data.error || "කණගාටුයි, පිළිතුර ලබාගැනීමට නොහැකි වුණා.";
        setSolution(errorMsg);
      }
    } catch (err) {
      console.error("Scanner API Error:", err);
      alert("පිළිතුර ලබාගැනීමට නොහැකි විය. නැවත උත්සාහ කරන්න!");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !userEmail) {
    return <div className="h-screen bg-slate-900"></div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden">
      <div className="p-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-indigo-100 fixed top-0 w-full z-20 shadow-sm">
        <Link href="/" className="text-xl text-indigo-600 font-bold hover:opacity-80 transition flex items-center gap-1">
          <span>🔙</span> මුල් පිටුවට
        </Link>
        <h2 className="text-base font-extrabold text-indigo-900">ප්‍රශ්නය Scan කරන්න 📷</h2>
        
        {messages.length > 0 ? (
          <button 
            onClick={clearHistory}
            className="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-100 transition font-medium"
          >
            Clear 🗑️
          </button>
        ) : (
          <div className="w-12"></div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative bg-slate-900 mt-[60px] h-[calc(100vh-160px)]">
        {!imgSrc ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="w-full max-w-xs h-64 border-2 border-dashed border-indigo-400 rounded-3xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] flex items-center justify-center">
                <span className="text-xs text-white/80 bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  ප්‍රශ්නය කොටුව ඇතුළත තබන්න
                </span>
              </div>
            </div>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt="Captured" className="w-full h-full object-contain bg-slate-900" />
        )}
      </div>

      <div className="p-5 px-6 flex flex-col items-center bg-white border-t border-indigo-50 z-10 shadow-lg">
        {!imgSrc ? (
          <div className="flex items-center justify-between w-full max-w-sm">
            <input 
              type="file" 
              accept="image/*" 
              id="gallery-input" 
              className="hidden" 
              onChange={handleGallerySelect} 
            />
            
            <label htmlFor="gallery-input" className="w-12 h-12 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer active:scale-95 transition border border-indigo-100 shadow-sm">
              <span className="text-xl">🖼️</span>
            </label>

            <button onClick={capturePhoto} className="w-18 h-18 bg-indigo-600 p-1.5 rounded-full shadow-lg shadow-indigo-200 active:scale-95 transition">
              <div className="w-full h-full bg-indigo-600 border-4 border-white rounded-full"></div>
            </button>
            
            <div className="w-12 h-12"></div>
          </div>
        ) : (
          <div className="flex gap-3 w-full max-w-sm">
            <button onClick={() => setImgSrc(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold transition">
              නැවත ගන්න 🔄
            </button>
            <button onClick={sendToAI} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold shadow-md shadow-indigo-200 transition disabled:opacity-50">
              {loading ? "හිතමින් පවතිනවා..." : "විසඳුම ගන්න 🚀"}
            </button>
          </div>
        )}
      </div>

      {solution && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 p-4 sm:p-6 overflow-y-auto flex justify-center items-start pt-10">
          <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-indigo-50 overflow-hidden my-auto">
            <div className="p-4 bg-slate-50 border-b border-indigo-50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-indigo-900">💡 ගණිත විසඳුම</h3>
              <button 
                onClick={() => { setSolution(null); setSvgCode(null); }} 
                className="bg-white hover:bg-rose-50 text-rose-500 px-3 py-1.5 rounded-xl border border-rose-100 text-xs font-bold transition"
              >
                වහන්න ✕
              </button>
            </div>
            
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              {svgCode && (
                <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex justify-center overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: svgCode }} />
                </div>
              )}

              <div className="prose prose-indigo max-w-none leading-relaxed text-slate-700 font-medium text-sm sm:text-base">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {solution}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        userEmail={userEmail}
      />

      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}