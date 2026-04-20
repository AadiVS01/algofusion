import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Clinical DB Credentials Missing. API routes will fail.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveSession(patientId, sessionData) {
  const timestamp = new Date().toISOString();
  console.log(`[ClinicAI | DB] - Indexing new session for Patient: ${patientId} at ${timestamp}`);
  
  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        patient_id: patientId,
        diagnosis: sessionData.diagnosis,
        summary: sessionData.follow_up, 
        medications: sessionData.medications,
        extracted_data: sessionData
      }
    ])
    .select();

  if (error) {
    console.error(`[ClinicAI | DB] - FAILED recording for Patient: ${patientId}. Error:`, error.message);
    throw error;
  }
  
  console.log(`[ClinicAI | DB] - SUCCESS! Session saved with ID: ${data[0].id}`);
  return data[0];
}

export async function getSessions(patientId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export const createPatient = async (patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select('patient_id')
    .single();

  if (error) throw error;
  return { patientId: data.patient_id };
};

export const getPatient = async (patientId) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_id', patientId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
};
