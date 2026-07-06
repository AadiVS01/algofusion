# ClinicAI

ClinicAI is an advanced, AI-powered medical application built with Next.js, designed to streamline clinical workflows. It leverages cutting-edge AI models, vector databases, and robust backend services to provide a comprehensive, intelligent clinic management solution.

## Specialities & Capabilities

* **AI-Assisted Diagnostics & Chat:** Integrates multiple large language models via Google Generative AI and Groq SDK to assist with medical queries, summarization, and data processing.
* **Retrieval-Augmented Generation (RAG):** Uses Pinecone vector databases to quickly retrieve relevant medical records, context, or literature to inform AI responses.
* **Automated PDF Generation:** Seamlessly generates structured reports, prescriptions, and medical summaries in PDF format using `jspdf` and `jspdf-autotable`.
* **Robust Backend Integration:** Utilizes Supabase for secure authentication, real-time database management, and robust data storage.
* **Instant Record Access:** Features dynamic QR code generation (`react-qr-code`) for quick access to digital patient records and clinic details.
* **Modern Tech Stack:** Built on Next.js and React 19 for optimal performance, server-side rendering, and a smooth user experience.

## Tech Stack

* **Frontend:** Next.js, React 19, Tailwind CSS
* **Backend & Auth:** Supabase
* **AI & Machine Learning:** Google Generative AI (Gemini), Groq SDK
* **Vector Database:** Pinecone
* **Utilities:** Axios, jsPDF, React QR Code

## Future Scope

Our vision for ClinicAI is to make it increasingly independent, secure, and resilient to network constraints. 

* **Complete Offline Capability (Gemma 4):** As a major upcoming feature, we plan to integrate **Gemma 4** to run directly on-device. This will allow ClinicAI to become **completely offline**, ensuring that all AI processing, data handling, and critical clinic operations can be performed securely and instantly without requiring an internet connection. This is crucial for privacy-first clinical environments and regions with unreliable connectivity.
* **Enhanced Multi-Modal AI:** Processing medical images (X-Rays, MRIs) directly within the offline AI models.
* **Advanced Predictive Analytics:** Forecasting patient influx and resource requirements based on historical data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
