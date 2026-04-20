import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveSession(patientId, sessionData) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([
      {
        patient_id: patientId,
        diagnosis: sessionData.diagnosis,
        summary: sessionData.follow_up, // or a summary field
        medications: sessionData.medications,
        extracted_data: sessionData
      }
    ])
    .select();

  if (error) throw error;
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
