"use client";

import UpgradeModal from "@/components/UpgradeModal";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useRouter } from "next/navigation";

// Part A Question Type
interface PartAQuestion {
  id: number;
  topic: string;
  questionText: string;
  svgDiagram?: string;
  correctAnswer: string;
  solutionSteps: string[];
  marks: number;
}

// Part B Sub-Question Type (Used for Paper 1 Part B and all of Paper 2)
interface PartBSubQuestion {
  subId: string;
  questionText: string;
  correctAnswer: string;
  solutionSteps: string[];
  marks: number;
}

// Part B Question Type (Used for Paper 1 Part B and all of Paper 2)
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

// Paper 2 Data Structure
interface Paper2Data {
  paperTitle: string;
  partA: PartBQuestion[];
  partB: PartBQuestion[];
}

export default function PaperPage() {
  const router = useRouter();

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

  // Common States
  const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // Paper 1: 120 mins
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // User Email සහ Pro Upgrade Modal සඳහා States
  const [userEmail, setUserEmail] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // Logged-in Check
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/login");
      return;
    }

    setUserEmail(email);
  }, [router]);

  // Helper function to calculate total and earned marks
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

  // ---------------------------------------------------------
  // PAPER 1 GENERATION & DATABASE SAVE
  // ---------------------------------------------------------
  const handleStartExam = async () => {
    if (loadingStage !== "idle") return;
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
        throw new Error(dataA.error || `A කොටස සකස් කරගැනීමට නොහැකි විය. (Status: ${resA.status})`);
      }

      // Delay 3s to prevent 429 Rate Limit between Part A and Part B
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoadingStage("partB");
      const resB = await fetch("/api/paper-generator/part-b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const dataB = await resB.json();
      if (!resB.ok || !dataB.success) {
        throw new Error(dataB.error || `B කොටස සකස් කරගැනීමට නොහැකි විය. (Status: ${resB.status})`);
      }

      const newPaper = {
        paperTitle: "අපොස (සා.පෙළ) ගණිතය - I ප්‍රශ්න පත්‍රය",
        partA: dataA.partA || [],
        partB: dataB.partB || [],
      };

      setPaper(newPaper);

      // Save generated Paper 1 to Firestore
      fetch("/api/db/save-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPaper, paperType: "paper1", userEmail }),
      }).catch((err) => console.error("Database Save Error:", err));

      setExamStarted(true);
      setTimeLeft(120 * 60); // Reset timer for Paper 1
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg(err.message || "API එක සම්බන්ධ කරගැනීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setLoadingStage("idle");
    }
  };

  // ---------------------------------------------------------
  // PAPER 2 GENERATION & DATABASE SAVE
  // ---------------------------------------------------------
  const handleStartPaper2 = async () => {
    if (loadingPaper2Stage !== "idle") return;
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
        throw new Error(dataA.error || `II පත්‍රයේ A කොටස සකස් කරගැනීමට නොහැකි විය. (Status: ${resA.status})`);
      }

      // Delay 3s to prevent 429 Rate Limit
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoadingPaper2Stage("partB");
      const resB = await fetch("/api/paper-generator/paper2-part-b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      const dataB = await resB.json();
      if (!resB.ok || !dataB.success) {
        throw new Error(dataB.error || `II පත්‍රයේ B කොටස සකස් කරගැනීමට නොහැකි විය. (Status: ${resB.status})`);
      }

      const newPaper2 = {
        paperTitle: "අපොස (සා.පෙළ) ගණිතය - II ප්‍රශ්න පත්‍රය",
        partA: dataA.paper2PartA || [],
        partB: dataB.paper2PartB || [],
      };

      setPaper2(newPaper2);

      // Save generated Paper 2 to Firestore
      fetch("/api/db/save-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPaper2, paperType: "paper2", userEmail }),
      }).catch((err) => console.error("Database Save Error:", err));

      setActivePaper("paper2");
      setTimeLeft(150 * 60); // Paper 2 කාලය පැය 2 1/2
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg(err.message || "II පත්‍රය සකස් කිරීමේදී දෝෂයක්. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoadingPaper2Stage("idle");
    }
  };

  // ---------------------------------------------------------
  // TIMER LOGIC
  // ---------------------------------------------------------
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

  // Submit Paper 1 & Save Results to Firestore
  const handleSubmitPaper1 = async () => {
    setIsSubmitted(true);

    if (paper) {
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

  // Submit Paper 2 & Save Results to Firestore
  const handleSubmitPaper2 = async () => {
    setIsPaper2Submitted(true);

    if (paper2) {
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50 relative print:bg-white print:p-0">
      {/* 🖨️ A4 Printing & Diagram Sizing Styles */}
      <style jsx global>{`
        .svg-container svg {
          max-width: 100% !important;
          max-height: 200px !important;
          width: auto !important;
          height: auto !important;
          margin: 0 auto;
          display: block;
        }

        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print,
          button,
          .sticky-header {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .question-card {
            page-break-inside: avoid !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            margin-bottom: 1.5rem !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      {/* ----------------- START SCREEN ----------------- */}
      {!examStarted ? (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white shadow-md rounded-2xl text-center border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            අපොස (සා.පෙළ) ගණිතය විභාගය
          </h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            I පත්‍රය සහ II පත්‍රය AI මගින් සජීවීව සකස් කරනු ලැබේ. පළමුව I ප්‍රශ්න පත්‍රයට මුහුණ දෙන්න.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {loadingStage !== "idle" && (
            <div className="mb-6 p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 text-sm font-medium space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></span>
                <span>
                  {loadingStage === "partA" && "1/2: A කොටස (කෙටි ප්‍රශ්න 25) නිර්මාණය වෙමින් පවතී..."}
                  {loadingStage === "partB" && "2/2: B කොටස (ව්‍යුහගත ප්‍රශ්න 5) නිර්මාණය වෙමින් පවතී..."}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleStartExam}
            disabled={loadingStage !== "idle"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 px-6 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loadingStage !== "idle" ? "ප්‍රශ්න පත්‍රය සකස් වෙමින් පවතී..." : "I ප්‍රශ්න පත්‍රය ආරම්භ කරන්න"}
          </button>
        </div>
      ) : (
        /* ----------------- EXAM SCREEN ----------------- */
        <div className="print-full-width">
          {/* Sticky Header with Timer */}
          <div className="sticky-header sticky top-4 bg-white/95 backdrop-blur border border-gray-200 py-4 px-6 mb-8 shadow-sm flex justify-between items-center z-10 rounded-2xl no-print">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {activePaper === "paper1" ? paper?.paperTitle : paper2?.paperTitle}
              </h2>
              <p className="text-xs text-gray-500">
                A කොටස: ප්‍රශ්න {activePaper === "paper1" ? paper?.partA?.length : paper2?.partA?.length} | 
                B කොටස: ප්‍රශ්න {activePaper === "paper1" ? paper?.partB?.length : paper2?.partB?.length}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block font-medium">ඉතිරි කාලය</span>
              <span className={`text-xl font-mono font-bold ${timeLeft < 600 ? "text-red-600 animate-pulse" : "text-blue-600"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-100 text-red-700 text-sm rounded-xl border border-red-200 text-center font-medium no-print">
              {errorMsg}
            </div>
          )}

          <div className="space-y-8">
            
            {/* ======================= PAPER 1 VIEW ======================= */}
            {activePaper === "paper1" && (
              <>
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">A කොටස - කෙටි ප්‍රශ්න</h2>
                  {paper?.partA?.map((q, index) => (
                    <div key={q.id || index} className="question-card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm border border-blue-100">
                          ප්‍රශ්නය {index + 1}
                        </span>
                        {q.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{q.topic}</span>}
                      </div>
                      
                      <div className="text-gray-800 text-base font-medium mb-3 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.questionText}</ReactMarkdown>
                      </div>

                      {q.svgDiagram && (
                        <div className="svg-container my-4 flex justify-center border border-gray-100 p-3 bg-gray-50 rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: q.svgDiagram }} />
                      )}

                      {/* Marking Scheme View on Submit */}
                      {isSubmitted && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-sm text-emerald-900 shadow-sm">
                          <h4 className="font-bold text-emerald-800 text-sm border-b border-emerald-200 pb-1">✓ නිවැරදි පිළිතුර සහ Marking Scheme:</h4>
                          <div className="text-emerald-900 font-semibold">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`**නිවැරදි පිළිතුර:** ${q.correctAnswer}`}</ReactMarkdown>
                          </div>
                          {q.solutionSteps && q.solutionSteps.length > 0 && (
                            <div className="text-xs text-emerald-800 space-y-1 pt-1">
                              <p className="font-semibold text-emerald-900">විසඳන පියවර:</p>
                              {q.solutionSteps.map((step, idx) => (
                                <div key={idx} className="pl-2 border-l-2 border-emerald-300">
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`• ${step}`}</ReactMarkdown>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">B කොටස - ව්‍යුහගත ප්‍රශ්න</h2>
                  {paper?.partB?.map((q, index) => (
                    <div key={q.id || index} className="question-card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm border border-purple-100">
                          ප්‍රශ්නය {index + 1}
                        </span>
                        {q.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{q.topic}</span>}
                      </div>

                      <div className="text-gray-900 font-semibold text-base bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.mainContext}</ReactMarkdown>
                      </div>

                      {q.svgDiagram && (
                        <div className="svg-container my-4 flex justify-center border border-gray-100 p-3 bg-gray-50 rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: q.svgDiagram }} />
                      )}

                      <div className="space-y-4 pl-2 md:pl-4 border-l-2 border-slate-200">
                        {q.subQuestions?.map((sub) => (
                          <div key={sub.subId} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">
                              <span className="font-bold mr-1">({sub.subId})</span>
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`${sub.questionText} **[ලකුණු ${sub.marks}]**`}</ReactMarkdown>
                            </div>

                            {isSubmitted && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-900">
                                <p className="font-bold">පිළිතුර: {sub.correctAnswer}</p>
                                {sub.solutionSteps && sub.solutionSteps.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <p className="font-semibold">පියවර:</p>
                                    {sub.solutionSteps.map((step, idx) => (
                                      <div key={idx} className="pl-2 border-l-2 border-emerald-300">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`• ${step}`}</ReactMarkdown>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Submit / Proceed Buttons for Paper 1 */}
                <div className="mt-10 text-center pb-12 border-t pt-8 border-gray-200 no-print">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitPaper1}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition duration-200 text-lg cursor-pointer"
                    >
                      I ප්‍රශ්න පත්‍රය අවසන් කර Marking Scheme බලන්න
                    </button>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl max-w-2xl mx-auto shadow-sm">
                      <h3 className="text-2xl font-bold text-blue-900 mb-3">🎉 I ප්‍රශ්න පත්‍රය අවසන්!</h3>
                      <p className="text-blue-700 mb-6 font-medium">ඉහතින් ඔබගේ නිවැරදි පිළිතුරු පරීක්ෂා කර දැන් II ප්‍රශ්න පත්‍රයට මුහුණ දෙන්න.</p>
                      
                      {loadingPaper2Stage !== "idle" && (
                        <div className="mb-6 flex flex-col items-center justify-center gap-2 text-blue-800 font-medium">
                          <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></span>
                          <span>
                            {loadingPaper2Stage === "partA" && "II පත්‍රය - A කොටස නිර්මාණය වෙමින් පවතී..."}
                            {loadingPaper2Stage === "partB" && "II පත්‍රය - B කොටස නිර්මාණය වෙමින් පවතී..."}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={handleStartPaper2}
                        disabled={loadingPaper2Stage !== "idle"}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-xl shadow-md transition duration-200 text-lg cursor-pointer"
                      >
                        {loadingPaper2Stage !== "idle" ? "කරුණාකර රැඳී සිටින්න..." : "II ප්‍රශ්න පත්‍රය ආරම්භ කරන්න 🚀"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ======================= PAPER 2 VIEW ======================= */}
            {activePaper === "paper2" && paper2 && (
              <>
                {/* Paper 2 Part A */}
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">A කොටස (ප්‍රශ්න 6)</h2>
                  {paper2.partA?.map((q, index) => (
                    <div key={q.id || index} className="question-card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm border border-indigo-100">ප්‍රශ්නය {index + 1}</span>
                        {q.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{q.topic}</span>}
                      </div>

                      <div className="text-gray-900 font-semibold text-base bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.mainContext}</ReactMarkdown>
                      </div>

                      {q.svgDiagram && (
                        <div className="svg-container my-4 flex justify-center border border-gray-100 p-3 bg-gray-50 rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: q.svgDiagram }} />
                      )}

                      <div className="space-y-4 pl-2 md:pl-4 border-l-2 border-slate-200">
                        {q.subQuestions?.map((sub) => (
                          <div key={sub.subId} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">
                              <span className="font-bold mr-1">({sub.subId})</span>
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`${sub.questionText} **[ලකුණු ${sub.marks}]**`}</ReactMarkdown>
                            </div>

                            {isPaper2Submitted && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-900">
                                <p className="font-bold">පිළිතුර: {sub.correctAnswer}</p>
                                {sub.solutionSteps && sub.solutionSteps.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <p className="font-semibold">පියවර:</p>
                                    {sub.solutionSteps.map((step, idx) => (
                                      <div key={idx} className="pl-2 border-l-2 border-emerald-300">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`• ${step}`}</ReactMarkdown>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Paper 2 Part B */}
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">B කොටස (ප්‍රශ්න 6)</h2>
                  {paper2.partB?.map((q, index) => (
                    <div key={q.id || index} className="question-card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm border border-purple-100">ප්‍රශ්නය {index + 7}</span>
                        {q.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">{q.topic}</span>}
                      </div>

                      <div className="text-gray-900 font-semibold text-base bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.mainContext}</ReactMarkdown>
                      </div>

                      {q.svgDiagram && (
                        <div className="svg-container my-4 flex justify-center border border-gray-100 p-3 bg-gray-50 rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: q.svgDiagram }} />
                      )}

                      <div className="space-y-4 pl-2 md:pl-4 border-l-2 border-slate-200">
                        {q.subQuestions?.map((sub) => (
                          <div key={sub.subId} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">
                              <span className="font-bold mr-1">({sub.subId})</span>
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`${sub.questionText} **[ලකුණු ${sub.marks}]**`}</ReactMarkdown>
                            </div>

                            {isPaper2Submitted && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-900">
                                <p className="font-bold">පිළිතුර: {sub.correctAnswer}</p>
                                {sub.solutionSteps && sub.solutionSteps.length > 0 && (
                                  <div className="space-y-1 pt-1">
                                    <p className="font-semibold">පියවර:</p>
                                    {sub.solutionSteps.map((step, idx) => (
                                      <div key={idx} className="pl-2 border-l-2 border-emerald-300">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`• ${step}`}</ReactMarkdown>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Submit Paper 2 */}
                <div className="mt-10 text-center pb-12 border-t pt-8 border-gray-200 no-print">
                  {!isPaper2Submitted ? (
                    <button
                      onClick={handleSubmitPaper2}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition duration-200 text-lg cursor-pointer"
                    >
                      II ප්‍රශ්න පත්‍රය අවසන් කර Marking Scheme බලන්න
                    </button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 p-8 rounded-2xl max-w-2xl mx-auto shadow-sm">
                      <h3 className="text-2xl font-bold text-green-900 mb-3">ඔබ සම්පූර්ණ විභාගයම අවසන් කළා! 🎉</h3>
                      <p className="text-green-800 font-medium mb-4">I සහ II ප්‍රශ්න පත්‍ර දෙකෙහිම නිවැරදි පිළිතුරු සහ Marking Scheme ඉහතින් පරීක්ෂා කරගත හැක.</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-xl shadow transition duration-200 cursor-pointer"
                      >
                        නැවත මුල සිට ආරම්භ කරන්න
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* PRO UPGRADE MODAL */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        userEmail={userEmail}
      />

    </div>
  );
}