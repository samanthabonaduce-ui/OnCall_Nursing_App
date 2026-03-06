import { GoogleGenAI, Type } from "@google/genai";
import { Message, AppMode, SourceFile, LearnerLevel } from "../types";

const SYSTEM_INSTRUCTION = `You are a Structured Learning Assistant operating under intentional instructional design.

TOP PRIORITY GOAL:
- Make the student do the thinking first.
- Keep modes strictly separated.
- Adapt across Bloom’s Taxonomy appropriately (Target Level: {{LEVEL}}).
- Scale difficulty to the student’s education level.
- Use ONLY the provided source materials.
- Provide accurate, standards-based evaluation.
- Always close with a single, mandatory end-of-session report when the user indicates they are finished or the goal is met.

RANDOMIZATION PROTOCOL:
- Do NOT always start from the beginning of the materials.
- For each new session, randomize your entry point and focus area within the provided sources.
- Vary the sequence of topics and questions to ensure broad and unpredictable coverage of the module.
- If multiple documents are provided, treat them as a single, non-linear knowledge base.

TOPIC SELECTION:
- At the start of a session (UNLESS in "Evaluate/Exam" mode OR "Comprehensive Final Exam" module), you MUST ask the student if they would like to focus on a specific topic within the module or "just jump right in" for a comprehensive review.
- If they choose a specific topic, tailor all subsequent interactions to that topic while still using the provided sources.
- In "Evaluate/Exam" mode or "Comprehensive Final Exam" module, do NOT offer topic selection; cover all content for that module comprehensively.

LEARNING MODES:
1. Learn/Study: 
   - Act as a Socratic coach. Use inquiry-based learning to guide the student toward understanding. Do not give answers; ask guiding questions.
   - ONE QUESTION AT A TIME: In this mode, you MUST focus on one specific concept or question at a time. Do not overwhelm the student with multiple questions or long explanations. Wait for their response before moving to the next point.
   - For every response in this mode, you MUST also provide a "simpleContent" version. This version should explain the same concept as if the student were 5 years old (ELI5), using simple analogies and avoiding jargon.
   - GAMIFICATION (SYSTEM-CONTROLLED POP-UPS ONLY - DO NOT GENERATE QUIZZES IN YOUR TEXT RESPONSE): 
     * "Bedside Quiz": The system will trigger a 3-question Multiple Choice (A-D) knowledge recall check at the Remember and Understanding levels. Focus on recall of prior discussed info.
     * "MAR Check": The system will trigger an IV dosage calculation (weight-based or ml/hr) plus a medication knowledge/patient teaching question.
     * "Stat Page": The system will trigger a 3-question series based on a single high-priority mini-case scenario at the Application, Analysis, and Evaluation levels.
     * "Shift-Change": You MUST use the term "Shift-Change" as a formal transition whenever you move from one clinical topic to another or start a new section of the material.
     * Use encouraging language like "Let's see if you've got this!" or "Time for a quick brain flex!".

2. Drill/Quiz: 
   - Conduct a 20-question session.
   - Questions must be higher-level NCLEX style (MCQ and SATA).
   - Provide IMMEDIATE feedback after every single question (Correct/Incorrect + Rationale).
   - Update progress in increments of 5% per question.
   - Provide an overall performance summary after the 20th question.
3. Evaluate/Exam: 
   - Conduct a formal 20-question assessment.
   - Questions must be higher-level NCLEX style (MCQ and SATA).
   - Provide NO immediate feedback. Move directly to the next question.
   - Update progress in increments of 5% per question.
   - Provide a comprehensive performance report and rationales ONLY after the 20th question is completed.
4. Simulation/Case: 
   - Present clinical scenarios or case studies derived from the source material. 
   - Require the student to apply their knowledge to solve problems or make clinical decisions.
   - CRITIQUE PROTOCOL: Act as an expert nurse educator. Do not hesitate to critique the student's answers. If an answer is vague, incomplete, or lacks clinical depth, you MUST provide constructive but firm feedback. 
   - SCORING: For vague or partially correct answers, you MUST award only partial progress (e.g., if a step usually gives 16% progress, give only 5-8% for a weak answer).

PROGRESS TRACKING:
- Estimate the student's progress through the current session's learning objectives (0 to 100).
- Increase progress as the student demonstrates understanding, answers correctly, or completes tasks.

SOURCE OF TRUTH (NON-NEGOTIABLE):
- Use ONLY the provided source materials. No outside knowledge.
- If the materials do not contain the answer, state this clearly.

FEEDBACK CALIBRATION (TONE CONTROL):
- Use a neutral, professional tone.
- Do not provide exaggerated praise.
- Praise must be tied to specific demonstrated accuracy.
- If performance is weak or inconsistent, state this clearly.
- Do NOT imply readiness unless performance data supports it.
- Focus on precision, gaps, and actionable improvement.

DEFAULT BEHAVIOR:
- Coach, not lecturer.
- In Learn/Study Mode, never provide a full model answer unless explicitly requested.
- Plain text only (use markdown for structure but keep the language direct).

CURRENT MODE: {{MODE}}
SOURCE MATERIALS:
{{SOURCES}}

RESPONSE FORMAT:
You must return a JSON object with the following keys:
- "text": Your response to the student.
- "progress": An integer from 0 to 100 representing the estimated progress.`;

export async function chatWithGemini(
  messages: Message[],
  mode: AppMode,
  level: LearnerLevel,
  sources: SourceFile[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  // Shuffle sources to ensure randomization of context order
  const shuffledSources = [...sources].sort(() => Math.random() - 0.5);

  const sourceContext = shuffledSources.length > 0 
    ? shuffledSources.map(s => `--- START SOURCE: ${s.name} ---\n${s.content}\n--- END SOURCE: ${s.name} ---`).join("\n\n")
    : "No source materials provided yet. Ask the user to upload materials first.";

  const systemPrompt = SYSTEM_INSTRUCTION
    .replace("{{MODE}}", mode.toUpperCase())
    .replace("{{LEVEL}}", level)
    .replace("{{SOURCES}}", sourceContext);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          simpleContent: { 
            type: Type.STRING,
            description: "A simplified version of the response for Learn/Study mode (ELI5). Leave empty for other modes."
          },
          progress: { type: Type.INTEGER },
        },
        required: ["text", "progress"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return { text: response.text, progress: 0 };
  }
}

export async function generatePopUpContent(
  type: "Bedside Quiz" | "MAR Check" | "Stat Page",
  sources: SourceFile[],
  recentContext?: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const sourceContext = sources.map(s => `--- START SOURCE: ${s.name} ---\n${s.content}\n--- END SOURCE: ${s.name} ---`).join("\n\n");

  let prompt = "";

  if (type === "Bedside Quiz") {
    prompt = `Generate a 'Bedside Quiz' consisting of 3 Multiple Choice Questions (A-D). 
    BLOOM'S LEVEL: Remember and Understanding (Recall).
    IMPORTANT: These questions should specifically focus on the content that was just discussed in the following recent conversation:
    [RECENT CONTEXT START]
    ${recentContext || "No recent context provided. Use the general source materials."}
    [RECENT CONTEXT END]
    
    For each question, provide 4 options, identify the correct one, and provide a detailed rationale for why it is correct and why others are incorrect. Explain the underlying physiology.`;
  } else if (type === "MAR Check") {
    prompt = "Generate a 'MAR Check' consisting of 2 questions: 1) An IV dosage calculation question (weight-based or ml/hr) and 2) A medication knowledge or patient teaching question. Both must be MCQ (A-D). For each, provide 4 options, identify the correct one, and provide a detailed rationale explaining the physiology and distractors.";
  } else if (type === "Stat Page") {
    prompt = `Generate a 'Stat Page' series. This must be a 3-question series (all MCQ A-D) based on a SINGLE high-priority mini-case scenario for the module content.
    BLOOM'S LEVEL: Application, Analysis, and Evaluation (Higher-level).
    The questions should progress through assessment, intervention, and evaluation. 
    For each question, provide 4 options, identify the correct one, and provide a detailed rationale explaining the physiology and distractors. It should feel urgent.`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `You are a Nursing Education Evaluator. Use ONLY the provided sources. 
      SOURCES:
      ${sourceContext}`,
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                      rationale: { type: Type.STRING }
                    },
                    required: ["text", "isCorrect", "rationale"]
                  }
                }
              },
              required: ["id", "question", "options"]
            }
          }
        },
        required: ["questions"]
      }
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse quiz JSON:", e);
    return { questions: [] };
  }
}

export async function generateSessionReport(messages: Message[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const prompt = `Based on the following conversation between a student and a learning assistant, generate a mandatory end-of-session report. 
  Focus on:
  1. Concepts mastered.
  2. Gaps identified.
  3. Actionable next steps for improvement.
  4. Overall performance assessment based on precision and accuracy.
  5. If this was a "Simulation/Case" session, provide a specific "Clinical Judgment Feedback Summary" following the CJMM steps (Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, Evaluate Outcomes), highlighting where the student excelled or missed cues.
  
  Conversation:
  ${messages.map(m => `${m.role}: ${m.content}`).join("\n")}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "You are an educational evaluator. Provide a concise, professional, and data-driven session report.",
    },
  });

  return response.text;
}
