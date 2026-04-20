import formidable from 'formidable';
import fs from 'fs';
import Groq from 'groq-sdk';
import { toFile } from 'groq-sdk/uploads';

export const config = {
  api: {
    bodyParser: false,
  },
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MIME_TO_EXT = {
  'audio/flac': 'flac',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'mp4',
  'audio/mpga': 'mpga',
  'audio/x-m4a': 'm4a',
  'audio/m4a': 'm4a',
  'audio/ogg': 'ogg',
  'audio/opus': 'opus',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/webm': 'webm',
};

function withSupportedAudioFilename(originalFilename, mimetype) {
  const safeName = (originalFilename || '').trim();
  const hasSupportedExt = /\.(flac|mp3|mp4|mpeg|mpga|m4a|ogg|opus|wav|webm)$/i.test(safeName);
  if (hasSupportedExt) return safeName;

  const ext = MIME_TO_EXT[mimetype] || 'webm';
  return `recording.${ext}`;
}

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

    const uploaded = files.file;
    const audioFile = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    if (!audioFile) throw new Error('No audio file provided');

    const filename = withSupportedAudioFilename(audioFile.originalFilename, audioFile.mimetype);
    console.log(`[ClinicAI | STT] - Processing audio file: ${filename} (Size: ${Math.round(audioFile.size / 1024)} KB)`);
    const audioBuffer = fs.readFileSync(audioFile.filepath);
    const file = await toFile(audioBuffer, filename, {
      type: audioFile.mimetype || 'audio/webm',
    });

    const result = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
    });

    console.log('[ClinicAI | STT] - Transcription SUCCESS');
    res.status(200).json({
      transcript: result.text,
      language_detected: result.language || 'hi-mr-en',
    });
  } catch (error) {
    console.error('[ClinicAI | STT] - Error:', error.message);
    res.status(500).json({ message: error.message });
  }
}
