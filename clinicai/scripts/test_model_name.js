const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function check() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  try {
    const result = await model.embedContent("Hello world");
    console.log("Success with text-embedding-004!");
  } catch (e) {
    console.log("Failed text-embedding-004:", e.message);
    try {
      const model2 = genAI.getGenerativeModel({ model: "embedding-001" });
      await model2.embedContent("Hello world");
      console.log("Success with embedding-001!");
    } catch (e2) {
      console.log("Failed embedding-001:", e2.message);
    }
  }
}
check();
