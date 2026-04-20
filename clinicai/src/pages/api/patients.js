import { getPatientProfile } from '../../services/supabase';

export default async function handler(req, res) {
  const { patientId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!patientId) {
    return res.status(400).json({ error: 'Patient ID required' });
  }

  try {
    const profile = await getPatientProfile(patientId);
    if (!profile) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
