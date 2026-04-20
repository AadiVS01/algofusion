import { saveSession, getSessions } from '@/services/supabase';

export default async function handler(req, res) {
  const { patientId } = req.query;

  if (req.method === 'GET') {
    try {
      const data = await getSessions(patientId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { sessionData } = req.body;
      const data = await saveSession(patientId, sessionData);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
