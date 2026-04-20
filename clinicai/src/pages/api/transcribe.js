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
  
  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const audioFile = files.file ? files.file[0] : null;
    if (!audioFile) throw new Error('No audio file provided');
    
    console.log(`[ClinicAI | STT] - Processing audio file: ${audioFile.originalFilename} (Size: ${Math.round(audioFile.size / 1024)} KB)`);
    const audioBuffer = fs.readFileSync(audioFile.filepath);
    
    const result = await transcribeAudio(audioBuffer, audioFile.originalFilename || 'audio.wav');
    
    console.log(`[ClinicAI | STT] - Transcription SUCCESS`);
    res.status(200).json(result);

  } catch (error) {
    console.error(`[ClinicAI | STT] - Error:`, error.message);
    res.status(500).json({ message: error.message });
  }
}
