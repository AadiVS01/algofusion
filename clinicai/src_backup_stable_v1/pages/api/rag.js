import { queryRAGGroq } from '@/services/groq';
import { getEmbeddings } from '@/services/gemini';
import { getSessions } from '@/services/supabase';
import { queryMedicalKB } from '@/services/pinecone';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { patientId, question } = req.body;

  try {
    // 1. Fetch History from Supabase
    const history = await getSessions(patientId);
    
    // 2. Fetch Medical Wisdom from Pinecone (Semantic)
    const vector = await getEmbeddings(question);
    const medicalReference = await queryMedicalKB(vector);
    
    // 3. Combined Query
    const combinedContext = {
      patient_history: history,
      medical_protocols: medicalReference
    };
    
    const answer = await queryRAGGroq(patientId, question, combinedContext);
    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
