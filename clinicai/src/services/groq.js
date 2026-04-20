import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SCHEMA = {
  type: "object",
  properties: {
    language_detected: { type: "string" },
    chief_complaint: { type: "string" },
    symptoms: { type: "array", items: { type: "string" } },
    duration: { type: "string" },
    diagnosis: { type: "string" },
    medications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          dosage: { type: "string" },
          frequency: { type: "string" },
          timing: { type: "string" }, // e.g., "After Lunch", "Morning & Night"
          duration: { type: "string" },
          flag: { type: "boolean" }
        },
        required: ["name"]
      }
    },
    follow_up: { type: "string" },
    possible_suggestions: { 
      type: "array", 
      items: { 
        type: "object",
        properties: {
          label: { type: "string" }, 
          reason: { type: "string" }  
        }
      } 
    },
    flags: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["high", "medium", "low"] }
  },
  required: ["language_detected", "chief_complaint", "diagnosis", "medications"]
};

export async function extractStructuredGroq(transcript, medicalContext = "", historyContext = "") {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a clinical documentation AI. Extract structured medical data from clinical transcripts (English). 
Return ONLY valid JSON according to this SCHEMA: ${JSON.stringify(SCHEMA)}

PRESCRIPTION PRECISION:
- For medications, strictly capture the drug name (name), dosage (dosage), frequency (frequency: prefer plain English like "Once a day", "Twice a day" - AVOID abbreviations like BD/OD/TDS), and TIMING (timing: e.g., "After Lunch").
- Example mapping:
  Input: "Take Paracetamol 500mg twice a day after lunch for 3 days"
  Output Part: {"name": "Paracetamol", "dosage": "500mg", "frequency": "Twice a day", "timing": "After Lunch", "duration": "3 days"}

RESILIENCE RULES:
1. BACKGROUND NOISE: Ignore linguistic 'noise'. Prioritize clinical logic.
2. AMBIGUITY: Check PATIENT HISTORY for "old medicine" references.
3. PHONETIC SAFETY: Use MEDICAL CONTEXT (ICMR) to resolve similar drug names.
4. SUGGESTIONS: Generate ICMR-based management steps. Prefix with "POSSIBLE".`
      },
      {
        role: "user",
        content: `
        MEDICAL CONTEXT (ICMR Guidelines):
        ${medicalContext}

        PATIENT HISTORY (Supabase Records):
        ${historyContext}

        CURRENT TRANSCRIPT:
        ${transcript}
        `
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

export async function queryRAGGroq(patientId, query, historyContext) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a clinical assistant. Use patient history and medical protocols to answer queries concisely."
      },
      {
        role: "user",
        content: `
        Patient ID: ${patientId}
        Combined Context: ${JSON.stringify(historyContext)}
        
        Question: ${query}
        `
      }
    ],
    model: "llama-3.3-70b-versatile"
  });

  return completion.choices[0].message.content;
}
