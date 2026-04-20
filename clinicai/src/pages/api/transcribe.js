import formidable from 'formidable';
import fs from 'fs';
import { transcribeAudio } from '@/services/sarvam';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const form = formidable();
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parsing error' });
    
    try {
      const audioFile = files.file ? files.file[0] : null;
      if (!audioFile) throw new Error('No audio file provided');
      
      const audioBuffer = fs.readFileSync(audioFile.filepath);
      
      // Pass buffer directly - service handles conversion
      const result = await transcribeAudio(audioBuffer, audioFile.originalFilename || 'audio.wav');
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Transcription API Error:', error);
      res.status(500).json({ message: error.message });
    }
  });
}
