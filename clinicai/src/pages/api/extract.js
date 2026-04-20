import { extractStructuredGroq } from '@/services/groq';
import { getEmbeddings } from '@/services/gemini';
import { queryMedicalKB } from '@/services/pinecone';
import { getPatient, getSessions } from '@/services/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { transcript, patientId } = req.body;

  try {
    console.log(`[ClinicAI | AI] - Starting extraction pipeline for Patient: ${patientId}`);
    console.log(`[ClinicAI | AI] - Transcript length: ${transcript.length} characters.`);

    // 1. Get embeddings for the transcript
    const vector = await getEmbeddings(transcript);
    
    // 2. Query Pinecone for Medical Wisdom (Parallel-ish)
    const medicalReference = await queryMedicalKB(vector);
    const medicalContext = medicalReference.map(m => m.text).join('\n');
    
    // 3. Query Supabase for Patient Memory
    const historyData = await getSessions(patientId);
    const historyContext = JSON.stringify(historyData);
    const patient = await getPatient(patientId);
    const patientContext = patient
      ? `Patient context:
- Known allergies: ${(patient.known_allergies || []).join(', ')}
- Chronic conditions: ${(patient.chronic_conditions || []).join(', ')}
- Current medications: ${(patient.current_medications || []).join(', ')}
Flag any prescribed medication that conflicts with known allergies.`
      : `Patient context:
- Known allergies: None recorded
- Chronic conditions: None recorded
- Current medications: None recorded
Flag any prescribed medication that conflicts with known allergies.`;

    // 4. Extract with Full Context (via Groq)
    const data = await extractStructuredGroq(transcript, medicalContext, historyContext, patientContext);
    
    console.log(`[ClinicAI | AI] - Extraction SUCCESS for Patient: ${patientId}`);
    res.status(200).json(data);
  } catch (error) {
    console.error(`[ClinicAI | AI] - Extraction FAILED for Patient: ${patientId}. Error:`, error.message);
    res.status(500).json({ message: error.message });
  }
}
