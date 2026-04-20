/**
 * contract.js
 * LOCK: Do not change these signatures.
 * Shared between Frontend and Backend.
 */

export async function transcribeAudio(audioBlob) {
  // Implementation in services/sarvam.js
}

export async function extractStructured(transcript) {
  // Implementation in services/gemini.js
}

export async function saveSession(patientId, sessionData) {
  // Implementation in services/firebase.js
}

export async function getSessions(patientId) {
  // Implementation in services/firebase.js
}

export async function queryRAG(patientId, question) {
  // Implementation in services/gemini.js
}
