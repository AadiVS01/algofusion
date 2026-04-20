import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import RAGChatbot from '@/components/RAGChatbot';

// Mock data for patient header
import mockConsultation from '@/../mock/consultation.json';

export default function AIInsightsPage() {
  const router = useRouter();
  const { patientId } = router.query;

  return (
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 p-10 bg-[#fdfdfd]">
      <Head>
        <title>{`AI Insights Hub | ${patientId || 'Global'}`}</title>
      </Head>
      
      {/* Premium Patient Header */}
      <header className="flex items-center justify-between bg-white px-10 py-8 sarvam-card">
        <div className="flex items-center gap-8">
          <Link href="/" className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all border border-slate-50">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-200">
              {patientId?.[0] || 'P'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-[#131313] tracking-tight">{mockConsultation.patient_name}</h1>
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>{patientId || 'P12345'}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>{mockConsultation.age}Y • {mockConsultation.gender === 'M' ? 'Male' : 'Female'}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-indigo-600">AI Intelligence Hub</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-indigo-100">
           <Sparkles className="w-5 h-5 text-indigo-600" />
           <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Global Medical RAG Active</p>
        </div>
      </header>

      {/* Full Screen AI Hub */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0">
        <div className="mb-6 flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-indigo-500" />
            <div>
              <h2 className="text-xl font-serif font-bold text-[#131313]">Clinical Insights Agent</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Deep Record Exploration</p>
            </div>
          </div>
        </div>
        
        {/* Chatbot occupying full space */}
        <div className="flex-1 min-h-[600px]">
          <RAGChatbot patientId={patientId || 'P12345'} />
        </div>
      </div>

    </div>
  );
}
