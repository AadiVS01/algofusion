const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST;

export async function queryMedicalKB(vector, topK = 3) {
  const url = `https://${PINECONE_HOST}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      namespace: 'clinical-wisdom',
      vector,
      topK,
      includeMetadata: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinecone error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.matches.map(match => ({
    text: match.metadata.text,
    source: match.metadata.source || 'Standard Guidelines',
    score: match.score
  }));
}
