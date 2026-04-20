import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { sessionId } = req.query;
  const { data, error } = await supabase.from('sessions').select('*').eq('id', sessionId).single();

  if (error) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json(data);
}
