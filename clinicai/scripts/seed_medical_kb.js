import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST;

const MEDICAL_DATA = [
  {
    id: "icmr_fever_001",
    text: "Fever Standard Treatment Workflow (ICMR): CORE TEMP > 38.0 C. RED FLAGS: Altered sensorium, hypotension, respiratory distress, petechial rash. INVESTIGATIONS: CBC, NS1/IgM for Dengue (if >3 days), Widal for Typhoid, Peripheral Smear for Malaria.",
    metadata: { source: "ICMR STW 2024", condition: "Fever", severity: "High" }
  },
  {
    id: "icmr_cough_001",
    text: "Cough Management (ICMR): If > 2 weeks, investigate for Pulmonary Tuberculosis. WET COUGH: Use Mucolytics (Guaifenesin). DRY COUGH: Rule out Asthma, GERD. Rule out Red Flags like Hemoptysis.",
    metadata: { source: "ICMR STW 2024", condition: "Cough", severity: "Medium" }
  },
  {
    id: "icmr_headache_001",
    text: "Headache Red Flags (ICMR): Fever with neck stiffness, sudden onset (thunderclap), personality change, focal neurologic signs. Differential: Tension vs Migraine vs Meningitis.",
    metadata: { source: "ICMR STW 2024", condition: "Headache", severity: "Life-Threatening" }
  }
];

async function seed() {
  console.log("Seeding Medical Knowledge Base to Pinecone (REST)...");
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  const vectors = [];
  for (const item of MEDICAL_DATA) {
    console.log(`Embedding: ${item.id}`);
    const result = await model.embedContent({
      content: { parts: [{ text: item.text }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 768
    });
    
    vectors.push({
      id: item.id,
      values: result.embedding.values,
      metadata: { text: item.text, ...item.metadata }
    });
  }

  console.log(`Prepared ${vectors.length} vectors. Sending to Pinecone at ${PINECONE_HOST}...`);

  const response = await fetch(`https://${PINECONE_HOST}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      namespace: 'clinical-wisdom',
      vectors: vectors
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinecone Upsert failed: ${JSON.stringify(error)}`);
  }

  console.log("Seeding complete! Medical Knowledge Base is now live in 'clinical-wisdom' namespace.");
}

seed().catch(console.error);
