export async function transcribeAudio(audioData, filename = 'audio.wav') {
  const formData = new FormData();
  
  const blob = (typeof Buffer !== 'undefined' && audioData instanceof Buffer) 
    ? new Blob([audioData], { type: 'audio/wav' })
    : audioData;

  formData.append('file', blob, filename);
  formData.append('model', 'saaras:v3');
  formData.append('language_code', 'hi-IN');
  formData.append('mode', 'translate');

  const response = await fetch('https://api.sarvam.ai/speech-to-text', {
    method: 'POST',
    headers: {
      'api-subscription-key': process.env.SARVAM_API_KEY
    },
    body: formData
  });

  if (!response.ok) {
    let errorMessage = `Sarvam API error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = JSON.stringify(errorData) || errorMessage;
    } catch (e) { /* ignore parse error */ }
    throw new Error(errorMessage);
  }

  return await response.json();
}
