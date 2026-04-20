/**
 * Transcription service — uses Groq Whisper (whisper-large-v3) via /api/transcribe.
 *
 * The actual Groq call lives in the API route; this client-side helper
 * posts the audio blob to that endpoint.
 */
export async function transcribeAudio(audioData, filename = 'audio.wav') {
  const formData = new FormData();
  
  const blob = (typeof Buffer !== 'undefined' && audioData instanceof Buffer) 
    ? new Blob([audioData], { type: 'audio/wav' })
    : audioData;

  formData.append('file', blob, filename);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Transcription API error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = JSON.stringify(errorData) || errorMessage;
    } catch (e) { /* ignore parse error */ }
    throw new Error(errorMessage);
  }

  return await response.json();
}
