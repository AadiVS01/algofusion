const MOCK_MODE = false;

export async function extractStructured(transcript) {
  // Placeholder for real-time extraction logic
  console.log("Extracting structured data from:", transcript);
  return null;
}

export async function queryRAG(patientId, question) {
  try {
    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, question }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch AI response");
    }

    return data.answer;
  } catch (err) {
    console.error("queryRAG Error:", err);
    throw err;
  }
}
