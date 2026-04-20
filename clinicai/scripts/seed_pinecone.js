import './loadEnv.js';
import { getEmbeddings } from '../src/services/gemini.js';
import { upsertMedicalKB } from '../src/services/pinecone.js';

const MEDICAL_DATA = [
    // --- HYPERTENSION ---
    {
        id: "hp-001",
        text: "Hypertension Management Protocol: Initial treatment for Stage 1 Hypertension (BP 130-139/80-89) often starts with Amlodipine 5mg OD or Telmisartan 40mg OD. Monitor BP weekly. Lifestyle changes: Salt reduction <5g/day, exercise 150min/week.",
        metadata: { category: "Cardiology", tags: ["Hypertension", "Amlodipine", "Telmisartan", "BP Management"] }
    },
    {
        id: "hp-002",
        text: "Amlodipine (Calcium Channel Blocker): Indicated for essential hypertension. Usual dose 5mg-10mg once daily. Side effects: Pedal edema, headache, flushing. Contraindicated in severe hypotension.",
        metadata: { category: "Pharmacology", tags: ["Amlodipine", "CCB", "Hypertension", "Side Effects"] }
    },
    // --- DIABETES ---
    {
        id: "dm-001",
        text: "Type 2 Diabetes Mellitus Protocol: First-line medication is Metformin 500mg BD after meals. Target HbA1c < 7%. If uncontrolled, consider adding Sitagliptin 100mg OD or Glimepiride 1mg OD. Monitor renal function.",
        metadata: { category: "Endocrinology", tags: ["Diabetes", "Metformin", "HbA1c", "Sitagliptin"] }
    },
    {
        id: "dm-002",
        text: "Metformin (Biguanide): First-line for T2DM. Decreases hepatic glucose production. Dose: 500mg-2000mg/day. Side effects: GI upset, metallic taste, B12 deficiency. Warning: Lactic acidosis (rare).",
        metadata: { category: "Pharmacology", tags: ["Metformin", "Diabetes", "Drug Profile"] }
    },
    // --- INFECTIONS / RESPIRATORY ---
    {
        id: "ur-001",
        text: "Common Cold & URI Protocol: Primarily viral. Treat symptoms. Cetirizine 10mg OD for rhinorrhea. Paracetamol 500mg TDS for fever/body ache. Avoid antibiotics unless secondary bacterial infection (yellow sputum, fever > 3 days) is suspected.",
        metadata: { category: "Primary Care", tags: ["Common Cold", "URI", "Cetirizine", "Paracetamol"] }
    },
    {
        id: "ur-002",
        text: "Cetirizine (H1-Antagonist): Second-generation antihistamine for allergic rhinitis, urticaria. Non-sedating at 10mg dose. Timing: Usually taken at bedtime.",
        metadata: { category: "Pharmacology", tags: ["Cetirizine", "Antihistamine", "Allergy"] }
    },
    {
        id: "in-001",
        text: "Amoxicillin + Clavulanic Acid (Augmentin): Broad-spectrum antibiotic for sinusitis, pneumonia, UTI. Dose: 625mg BD for 5-7 days. Side effects: Diarrhea, rash. Always complete the full course.",
        metadata: { category: "Infectious Disease", tags: ["Antibiotics", "Amoxicillin", "Infection"] }
    },
    // --- GASTRO ---
    {
        id: "ga-001",
        text: "Gastritis & GERD Management: Pantoprazole 40mg (Pan 40) taken 30min before breakfast. Avoid spicy food, caffeine, and lying down immediately after meals. Consider liquid antacids (e.g., Digene) for immediate relief.",
        metadata: { category: "Gastroenterology", tags: ["GERD", "Gastritis", "Pantoprazole", "Pan 40"] }
    },
    {
        id: "ga-002",
        text: "Pantoprazole (PPI): Proton Pump Inhibitor for acid reflux and peptic ulcers. Dose: 40mg OD. Long-term use requires monitoring Vitamin B12 and Magnesium levels.",
        metadata: { category: "Pharmacology", tags: ["Pantoprazole", "PPI", "Acid Reflux"] }
    },
    // --- PAIN ---
    {
        id: "pn-001",
        text: "Pain Management (Mild to Moderate): Paracetamol 650mg up to QID. For inflammation, Naproxen 250mg BD with food. Warning: Chronic NSAID use leads to renal strain and gastric ulcers.",
        metadata: { category: "Primary Care", tags: ["Pain Relief", "Paracetamol", "Naproxen", "NSAID"] }
    },
    // --- CARDIAC RISK ---
    {
        id: "cr-001",
        text: "Atorvastatin (Statin): For Dyslipidemia and cardiovascular risk reduction. Dose: 10mg-40mg at bedtime. Monitor Lipid Profile and Liver Enzymes (ALT/AST). Muscle pain is a reported side effect.",
        metadata: { category: "Pharmacology", tags: ["Atorvastatin", "Statins", "Cholesterol"] }
    },
    {
        id: "cr-002",
        text: "Aspirin 75mg (Eco-sprin): Low-dose antiplatelet for secondary prevention of MI and Stroke. Take after meals to minimize gastric irritation.",
        metadata: { category: "Cardiology", tags: ["Aspirin", "Antiplatelet", "Cardiac Risk"] }
    }
];

async function seed() {
    console.log(`[Seeder] - Starting process. Records to process: ${MEDICAL_DATA.length}`);
    const vectors = [];

    for (const item of MEDICAL_DATA) {
        try {
            console.log(`[Seeder] - Embedding: ${item.id}`);
            const embedding = await getEmbeddings(item.text);
            
            vectors.push({
                id: item.id,
                values: embedding,
                metadata: {
                    text: item.text,
                    ...item.metadata
                }
            });
        } catch (error) {
            console.error(`[Seeder] - Failed for ${item.id}:`, error.message);
        }
    }

    console.log(`[Seeder] - Generated all embeddings. Upserting to Pinecone...`);
    try {
        const result = await upsertMedicalKB(vectors);
        console.log(`[Seeder] - SUCCESS! Pinecone response:`, result);
    } catch (error) {
        console.error(`[Seeder] - SHUTDOWN ERROR:`, error.message);
    }
}

seed();
