import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX_NAME);

async function test() {
  console.log("Testing basic Pinecone upsert...");
  const vectors = [
    {
      id: "test_1",
      values: Array(3072).fill(0.1), // Matching the length seen in previous error or trying 1536
      metadata: { text: "test" }
    }
  ];
  try {
    await index.upsert(vectors);
    console.log("Upsert Success!");
  } catch (e) {
    console.error("Upsert Failed:", e.message);
  }
}
test();
