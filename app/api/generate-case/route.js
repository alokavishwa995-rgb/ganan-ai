import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const olMathLessons = [
  { topic: "පරිමිතිය සහ වර්ගඵලය", concept: "Perimeter and Area" },
  { topic: "ප්‍රතිශත සහ වට්ටම්", concept: "Percentages and Discounts" },
  { topic: "පයිතගරස් ප්‍රමේයය", concept: "Pythagoras Theorem" },
  { topic: "ත්‍රිකෝණමිතිය", concept: "Trigonometry - Angles of elevation/depression" },
  { topic: "වේගය සහ කාලය", concept: "Speed, Distance, and Time" }
];

const crimeScenarios = [
  "කොළඹ රත්තරන් සොරකමක්",
  "විද්‍යාගාරයේ උපකරණයක් අතුරුදහන් වීම",
  "ප්‍රසිද්ධ ක්‍රිකට් තරඟයකදී මැච් එක පාවා දීමක්"
];

export async function POST(req) {
  try {
    const randomLesson = olMathLessons[Math.floor(Math.random() * olMathLessons.length)];
    const randomCrime = crimeScenarios[Math.floor(Math.random() * crimeScenarios.length)];

    const result = await generateObject({
      model: google('gemini-3.6-flash'), // ඔයාගේ Vercel AI SDK එකේ Model එක
      schema: z.object({
        caseTitle: z.string().describe("අභිරහසේ නිර්මාණශීලී නම"),
        storyBackground: z.string().describe("සිද්ධිය සිදුවූ ආකාරය පිළිබඳ කෙටි විස්තරයක්"),
        suspects: z.array(z.object({
          id: z.number(),
          name: z.string(),
          statement: z.string().describe("සැකකරු පවසන ප්‍රකාශය. මෙයින් එක් අයෙකුගේ ප්‍රකාශය පමණක් ගණිතමය වශයෙන් බොරුවක් විය යුතුය.")
        })).length(3),
        mathClue: z.object({
          question: z.string().describe("ළමයා විසඳිය යුතු ගණිත ගැටළුව"),
          correctAnswer: z.string().describe("නිවැරදි පිළිතුර (අංකයක් පමණක් ලබා දෙන්න, උදා: 160)"),
          explanation: z.string().describe("පිළිතුර ලබා ගන්නා ආකාරය පිළිබඳ කෙටි පැහැදිලි කිරීමක්")
        })
      }),
      prompt: `ඔබ O/L ගණිතය උගන්වන රහස් පරීක්ෂකයෙකි. 
      පහත දත්ත පදනම් කරගෙන 'Math Mafia' ක්‍රීඩාව සඳහා නව නඩුවක් සකසන්න:
      - අපරාධය: ${randomCrime}
      - ගණිත පාඩම: ${randomLesson.topic} (${randomLesson.concept})
      සැකකරුවන් 3 දෙනෙක් සිටිය යුතු අතර, එක් අයෙකුගේ ප්‍රකාශයක් පමණක් ගණිතමය වශයෙන් වැරදි විය යුතුය. සම්පූර්ණ ප්‍රතිදානය සිංහලෙන් ලබා දෙන්න.`
    });

    return Response.json({ success: true, caseData: result.object });

  } catch (error) {
    console.error("Error generating case:", error);
    return Response.json({ success: false, error: "නඩුව සකස් කිරීමේදී දෝෂයක් ඇති විය." }, { status: 500 });
  }
}