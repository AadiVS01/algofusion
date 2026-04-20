const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
const { generateProtocols } = require('./generate_opd_kb');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function getEmbedding(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_DOCUMENT",
    outputDimensionality: 768
  });
  return result.embedding.values;
}

async function upsertToPinecone(vectors) {
  const url = `https://${PINECONE_HOST}/vectors/upsert`;
  
  await axios.post(url, {
    vectors,
    namespace: "clinical-guidelines"
  }, {
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    }
  });
}

async function startBulkSeeding() {
  console.log("--- STARTING BULK CLINICAL SEEDING ---");
  
  try {
    // 1. Generate expert protocols via Groq
    const protocols = await generateProtocols();
    
    console.log(`\nStarting Embedding & Ingestion for ${protocols.length} protocols...`);
    
    const pineconeVectors = [];
    
    for (let i = 0; i < protocols.length; i++) {
      const p = protocols[i];
      console.log(`[${i+1}/${protocols.length}] Embedding: ${p.topic}`);
      
      try {
        const vector = await getEmbedding(p.content);
        
        pineconeVectors.push({
          id: `opd-protocol-${Date.now()}-${i}`,
          values: vector,
          metadata: {
            title: p.topic,
            content: p.content,
            source: "StatPearls (Expert AI Synth)",
            category: "OPD-Standard-Protocol"
          }
        });
        
        // Add a small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`Failed to embed ${p.topic}:`, err.message);
      }
    }
    
    // 2. Batch Upsert to Pinecone
    console.log(`\nUpserting ${pineconeVectors.length} vectors to Pinecone...`);
    
    // Upsert in chunks of 50 to be safe
    for (let i = 0; i < pineconeVectors.length; i += 50) {
      const chunk = pineconeVectors.slice(i, i + 50);
      await upsertToPinecone(chunk);
      console.log(`- Upserted chunk ${i/50 + 1}`);
    }
    
    console.log("\n✅ BULK SEEDING COMPLETE!");
    
  } catch (err) {
    console.error("Bulk Seeding Failed:", err.message);
  }
}

startBulkSeeding();
