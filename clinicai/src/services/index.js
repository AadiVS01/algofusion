// src/services/sarvam.js
const MOCK_MODE = true;

export async function transcribeAudio(audioBlob) {
  // TODO: Implement Sarvam AI transcription
  // For now, return mock if MOCK_MODE is true
}

// src/services/gemini.js
const MOCK_MODE = true;

export async function extractStructured(transcript) {
  // TODO: Implement Gemini 1.5 Flash extraction
}

export async function queryRAG(patientId, question) {
  // TODO: Implement RAG query logic
}

// src/services/firebase.js
export async function initFirebase() {
  // TODO: Initialize Firestore
}

export async function saveSession(patientId, sessionData) {
  // TODO: Firestore save logic
}

export async function getSessions(patientId) {
  // TODO: Firestore fetch logic
}
