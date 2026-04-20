const OPD_TOPICS = [
  "Common Cold / Viral Fever", "Acute Bronchitis", "Allergic Rhinitis", "Bronchial Asthma",
  "Hypertension Management", "Type 2 Diabetes Mellitus", "Dyslipidemia",
  "Acute Gastroenteritis", "Acid Peptic Disease / GERD", "Urinary Tract Infection (UTI)",
  "Low Back Pain / Spondylosis", "Osteoarthritis", "Anaemia in Adults",
  "Thyroid Disorders (Hypothyroidism)", "Dengue Fever Prevention and Management",
  "Typhoid Fever", "Bacillary Dysentery", "Skabies / Skin Fungal Infections",
  "Pediatric Diarrhea / ORS Management", "Upper Respiratory Tract Infection (Pediatric)",
  "Otitis Media", "Pharyngitis / Tonsillitis", "Migraine / Tension Headache",
  "Chronic Obstructive Pulmonary Disease (COPD)", "Ischemic Heart Disease (Initial OPD)",
  "Gout / Hyperuricemia", "Hemorrhoids", "Constipation", "Eczema / Atopic Dermatitis",
  "Acne Vulgaris", "Vaginal Candidiasis", "Antenatal OPD Care Basics",
  "Scorpion Sting / Snake Bite (Initial Stabilization)", "Malaria (Falciparum vs Vivax)",
  "Hyperpyrexia Management", "Generalized Anxiety Disorder (OPD)", "Insomnia",
  "Essential Tremors", "Vitamin D / B12 Deficiency", "Psoriasis",
  "Dermatophytosis (Tinea Corporis)", "Infected Wounds / Cellulitis"
];

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateProtocols() {
  console.log(`Generating protocols for ${OPD_TOPICS.length} topics...`);
  const protocols = [];
  
  for (const topic of OPD_TOPICS) {
    console.log(`- Generating: ${topic}`);
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a senior medical consultant. Summarize the clinical protocol for common OPD conditions. Include: Disease definition, Key Symptoms, Red Flags, and ICMR-Standard Treatment. Output in plain text for semantic search."
        },
        {
          role: "user",
          content: `Generate a concise clinical protocol for: ${topic}`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });
    
    protocols.push({
      topic,
      content: completion.choices[0].message.content
    });
  }
  
  return protocols;
}

module.exports = { generateProtocols, OPD_TOPICS };
