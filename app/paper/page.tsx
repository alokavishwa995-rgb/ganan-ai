"use client";

import UpgradeModal from "@/components/UpgradeModal";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useRouter } from "next/navigation";

interface PartAQuestion {
  id: number;
  topic: string;
  questionText: string;
  svgDiagram?: string;
  correctAnswer: string;
  solutionSteps: string[];
  marks: number;
}

interface PartBSubQuestion {
  subId: string;
  questionText: string;
  correctAnswer: string;
  solutionSteps: string[];
  marks: number;
}

interface PartBQuestion {
  id: number;
  topic: string;
  mainContext: string;
  svgDiagram?: string;
  totalMarks: number;
  subQuestions: PartBSubQuestion[];
}

interface PaperData {
  paperTitle: string;
  partA: PartAQuestion[];
  partB: PartBQuestion[];
}

interface Paper2Data {
  paperTitle: string;
  partA: PartBQuestion[];
  partB: PartBQuestion[];
}

export default function PaperPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Paper 1 States
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [loadingStage, setLoadingStage] = useState<"idle" | "partA" | "partB">("idle");
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answersA, setAnswersA] = useState<{ [key: number]: string }>({});
  const [answersB, setAnswersB] = useState<{ [key: string]: string }>({});

  // Paper 2 States
  const [activePaper, setActivePaper] = useState<"paper1" | "paper2">("paper1");
  const [paper2, setPaper2] = useState<Paper2Data | null>(null);
  const [loadingPaper2Stage, setLoadingPaper2Stage] = useState<"idle" | "partA" | "partB">("idle");
  const [isPaper2Submitted, setIsPaper2Submitted] = useState<boolean>(false);
  const [answers2A, setAnswers2A] = useState<{ [key: string]: string }>({});
  const [answers2B, setAnswers2B] = useState<{ [key: string]: string }>({});

  const [timeLeft, setTimeLeft] = useState<number>(120 * 60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/login");
      return;
    }

    setUserEmail(email);

    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get("status");
    const returnEmail = queryParams.get("email") || email;

    if (status === "success" && returnEmail) {
      fetch("/api/upgrade-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: returnEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("🎉 ගෙවීම සාර්ථකයි! ඔබගේ ගිණුම Pro Package එකට සාර්ථකව මාරු විය.");
            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.reload();
          }
        })
        .catch((err) => console.error("Auto Upgrade Error:", err));
    } else if (status === "cancel") {
      alert("❌ ගෙවීම අවලංගු කරන ලදී.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [router]);

  const calculateMarks = (
    paperPartA: any[],
    studentAnswersA: { [key: string]: string },
    paperPartB: PartBQuestion[],
    studentAnswersB: { [key: string]: string }
  ) => {
    let earned = 0;
    let total = 0;

    paperPartA?.forEach((q) => {
      if ('subQuestions' in q) {
        q.subQuestions?.forEach((sub: PartBSubQuestion) => {
          total += sub.marks || 0;
          const key = `${q.id}_${sub.subId}`;
          if (studentAnswersA[key]?.trim().toLowerCase() === sub.correctAnswer?.trim().toLowerCase()) {
            earned += sub.marks || 0;
          }
        });
      } else {
        total += q.marks || 2;
        if (studentAnswersA[q.id]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) {
          earned += q.marks || 2;
        }
      }
    });

    paperPartB?.forEach((q) => {
      q.subQuestions?.forEach((sub) => {
        total += sub.marks || 0;
        const key = `${q.id}_${sub.subId}`;
        if (studentAnswersB[key]?.trim().toLowerCase() === sub.correctAnswer?.trim().toLowerCase()) {
          earned += sub.marks || 0;
        }
      });
    });

    return { earned, total };
  };

  const handleStartExam = async () => {
    if (loadingStage !== "idle" || !userEmail) return;
    setErrorMsg(null);

    try {
      setLoadingStage("partA");
      const resA = await fetch("/api/paper-generator/part-a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (resA.status === 429) {
        setShowUpgradeModal(true);
        setLoadingStage("idle");
        return;
      }

      const dataA = await resA.json();
      if (!resA.ok || !dataA.success) {
        throw new Error(dataA.error || `A කොටස සකස් කරගැනීමට නොහැකි විය.`);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoadingStage("partB");
      const resB = await fetch("/api/paper-generator/part-b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const dataB = await resB.json();
      if (!resB.ok || !dataB.success) {
        throw new Error(dataB.error || `B කොටස සකස් කරගැනීමට නොහැකි විය.`);
      }

      const newPaper = {
        paperTitle: "අපොස (සා.පෙළ) ගණිතය - I ප්‍රශ්න පත්‍රය",
        partA: dataA.partA || [],
        partB: dataB.partB || [],
      };

      setPaper(newPaper);

      fetch("/api/db/save-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPaper, paperType: "paper1", userEmail }),
      }).catch((err) => console.error("Database Save Error:", err));

      setExamStarted(true);
      setTimeLeft(120 * 60);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg(err.message || "API එක සම්බන්ධ කරගැනීමට නොහැකි විය.");
    } finally {
      setLoadingStage("idle");
    }
  };

  const handleStartPaper2 = async () => {
    if (loadingPaper2Stage !== "idle" || !userEmail) return;
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      setLoadingPaper2Stage("partA");
      const resA = await fetch("/api/paper-generator/paper2-part-a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (resA.status === 429) {
        setShowUpgradeModal(true);
        setLoadingPaper2Stage("idle");
        return;
      }

      const dataA = await resA.json();
      if (!resA.ok || !dataA.success) {
        throw new Error(dataA.error || `II පත්‍රයේ A කොටස සකස් කරගැනීමට නොහැකි විය.`);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoadingPaper2Stage("partB");
      const resB = await fetch("/api/paper-generator/paper2-part-b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const dataB = await resB.json();
      if (!resB.ok || !dataB.success) {
        throw new Error(dataB.error || `II පත්‍රයේ B කොටස සකස් කරගැනීමට නොහැකි විය.`);
      }

      const newPaper2 = {
        paperTitle: "අපොස (සා.පෙළ) ගණිතය - II ප්‍රශ්න පත්‍රය",
        partA: dataA.paper2PartA || [],
        partB: dataB.paper2PartB || [],
      };

      setPaper2(newPaper2);

      fetch("/api/db/save-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPaper2, paperType: "paper2", userEmail }),
      }).catch((err) => console.error("Database Save Error:", err));

      setActivePaper("paper2");
      setTimeLeft(150 * 60);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg(err.message || "II පත්‍රය සකස් කිරීමේදී දෝෂයක්.");
    } finally {
      setLoadingPaper2Stage("idle");
    }
  };

  useEffect(() => {
    if (!examStarted) return;
    if (activePaper === "paper1" && isSubmitted) return;
    if (activePaper === "paper2" && isPaper2Submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (activePaper === "paper1") handleSubmitPaper1();
          if (activePaper === "paper2") handleSubmitPaper2();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, isPaper2Submitted, activePaper]);

  const handleSubmitPaper1 = async () => {
    setIsSubmitted(true);
    if (paper && userEmail) {
      const marks = calculateMarks(paper.partA, answersA, paper.partB, answersB);
      const timeSpent = 120 * 60 - timeLeft;

      try {
        await fetch("/api/db/save-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paperType: "paper1",
            totalMarks: marks.total,
            earnedMarks: marks.earned,
            timeSpent,
            studentAnswers: { partA: answersA, partB: answersB },
            userEmail,
          }),
        });
      } catch (err) {
        console.error("Result Save Error:", err);
      }
    }
  };

  const handleSubmitPaper2 = async () => {
    setIsPaper2Submitted(true);
    if (paper2 && userEmail) {
      const marks = calculateMarks(paper2.partA, answers2A, paper2.partB, answers2B);
      const timeSpent = 150 * 60 - timeLeft;

      try {
        await fetch("/api/db/save-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paperType: "paper2",
            totalMarks: marks.total,
            earnedMarks: marks.earned,
            timeSpent,
            studentAnswers: { partA: answers2A, partB: answers2B },
            userEmail,
          }),
        });
      } catch (err) {
        console.error("Result Save Error:", err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!isClient || !userEmail) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50 relative print:bg-white print:p-0">
      <style jsx global>{`
        .svg-container svg {
          max-width: 100% !important;
          max-height: 200px !important;
          width: auto !important;
          height: auto !important;
          margin: 0 auto;
          display: block;
        }
      `}</style>

      {!examStarted ? (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white shadow-md rounded-2xl text-center border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">අපොස (සා.පෙළ) ගණිතය විභාගය</h1>
          <p className="text-gray-600 mb-6 text-sm">I පත්‍රය සහ II පත්‍රය AI මගින් සජීවීව සකස් කරනු ලැබේ.</p>

          {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{errorMsg}</div>}

          {loadingStage !== "idle" && (
            <div className="mb-6 p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 text-sm font-medium">
              {loadingStage === "partA" && "1/2: A කොටස නිර්මාණය වෙමින් පවතී..."}
              {loadingStage === "partB" && "2/2: B කොටස නිර්මාණය වෙමින් පවතී..."}
            </div>
          )}

          <button
            onClick={handleStartExam}
            disabled={loadingStage !== "idle"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow transition"
          >
            {loadingStage !== "idle" ? "සකස් වෙමින් පවතී..." : "I ප්‍රශ්න පත්‍රය ආරම්භ කරන්න"}
          </button>
        </div>
      ) : (
        <div>
          <div className="sticky top-4 bg-white/95 backdrop-blur border border-gray-200 py-4 px-6 mb-8 shadow-sm flex justify-between items-center z-10 rounded-2xl">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {activePaper === "paper1" ? paper?.paperTitle : paper2?.paperTitle}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">ඉතිරි කාලය</span>
              <span className="text-xl font-mono font-bold text-blue-600">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {activePaper === "paper1" && paper && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">A කොටස</h2>
              {paper.partA.map((q, index) => (
                <div key={q.id || index} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <p className="font-medium text-gray-800 mb-2">{index + 1}. {q.questionText}</p>
                  {q.svgDiagram && <div className="svg-container my-3" dangerouslySetInnerHTML={{ __html: q.svgDiagram }} />}
                </div>
              ))}
              <button
                onClick={handleSubmitPaper1}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow"
              >
                ප්‍රශ්න පත්‍රය අවසන් කරන්න
              </button>
            </div>
          )}
        </div>
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} userEmail={userEmail} />
    </div>
  );
}