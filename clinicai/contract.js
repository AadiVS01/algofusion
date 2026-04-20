/**
 * contract.js
 * LOCK: Do not change these signatures.
 * Shared between Frontend and Backend.
 */

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData
  });
  return await response.json();
}

export async function extractStructured(transcript, patientId) {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, patientId })
  });
  return await response.json();
}

export async function saveSession(patientId, sessionData) {
  const response = await fetch(`/api/sessions?patientId=${patientId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionData })
  });
  return await response.json();
}

export async function getSessions(patientId) {
  const response = await fetch(`/api/sessions?patientId=${patientId}`);
  return await response.json();
}

export async function queryRAG(patientId, question) {
  const response = await fetch('/api/rag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, question })
  });
  const data = await response.json();
  return data.answer;
}
