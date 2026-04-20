import { createPatient, getPatient } from '@/services/supabase';

export default async function handler(req, res) {
  const toMessage = (error) => {
    if (error?.code === 'PGRST205' || String(error?.message || '').includes("Could not find the table 'public.patients'")) {
      return "Supabase table 'public.patients' is missing. Run scripts/create_patients_table.sql in Supabase SQL Editor.";
    }
    return error?.message || 'Unknown error';
  };

  if (req.method === 'POST') {
    try {
      const { patientData } = req.body || {};
      if (!patientData) {
        return res.status(400).json({ message: 'patientData is required' });
      }

      const result = await createPatient(patientData);
      return res.status(201).json(result);
    } catch (error) {
      console.error('[ClinicAI | API] - Create patient failed:', error.message);
      return res.status(500).json({ message: toMessage(error) });
    }
  }

  if (req.method === 'GET') {
    try {
      const { patientId } = req.query;
      if (!patientId) {
        return res.status(400).json({ message: 'patientId is required' });
      }

      const patient = await getPatient(patientId);
      return res.status(200).json({ patient });
    } catch (error) {
      console.error('[ClinicAI | API] - Fetch patient failed:', error.message);
      return res.status(500).json({ message: toMessage(error) });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
