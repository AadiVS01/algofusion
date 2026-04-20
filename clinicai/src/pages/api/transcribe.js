import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { transcribeGroq } from '@/services/groq';

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
    
    // Fix: Groq Whisper requires a supported extension (e.g. .wav, .mp3) to recognize the file type.
    // Formidable often saves files to a temp directory with a name like 'blob' or a random hash without an extension.
    const tempDir = path.dirname(audioFile.filepath);
    const fileNameWithExt = `${audioFile.newFilename || 'audio'}.wav`;
    const newPath = path.join(tempDir, fileNameWithExt);
    
    fs.renameSync(audioFile.filepath, newPath);
    
    console.log(`[ClinicAI | Groq Turbo] - Processing audio: ${audioFile.originalFilename} -> ${fileNameWithExt} (${Math.round(audioFile.size / 1024)} KB)`);
    
    // Use the new path with the .wav extension for Groq's stream handling
    const result = await transcribeGroq(newPath);
    
    // Cleanup the temporary file
    try {
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
    } catch (cleanupError) {
        console.error(`[ClinicAI | Groq Turbo] - Cleanup partial failure:`, cleanupError.message);
    }
    
    console.log(`[ClinicAI | Groq Turbo] - Transcription SUCCESS`);
    res.status(200).json(result);

  } catch (error) {
    console.error(`[ClinicAI | Groq Turbo] - Error details:`, error.message);
    res.status(500).json({ message: error.message });
  }
}
