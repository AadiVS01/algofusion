// src/pages/api/rag.js
export default async function handler(req, res) {
  // TODO: Fetch session from Firestore, pass to Gemini
  res.status(200).json({ message: "RAG endpoint skeleton" });
}
