import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

async function getHost() {
  const desc = await pc.describeIndex(process.env.PINECONE_INDEX_NAME);
  console.log("Index Host:", desc.host);
}
getHost();
