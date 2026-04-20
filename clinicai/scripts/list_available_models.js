require('dotenv').config({ path: '.env.local' });

async function list() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.models) {
    console.log("Supported embedding models:");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes('embedContent')) {
        console.log("- " + m.name);
      }
    });
  } else {
    console.log("No models found. Error:", data.error);
  }
}
list();
