import { createPatient } from '../../services/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const patientData = req.body;

  if (!patientData.name || !patientData.age) {
    return res.status(400).json({ error: 'Missing required patient data' });
  }

  // Generate a patient ID if not provided (though the UI should handle this)
  if (!patientData.patient_id) {
    patientData.patient_id = 'P' + Math.floor(10000 + Math.random() * 90000);
  }

  try {
    const newPatient = await createPatient(patientData);
    return res.status(201).json(newPatient);
  } catch (error) {
    console.error('Registration API Error:', error);
    return res.status(500).json({ error: 'Failed to register patient' });
  }
}
