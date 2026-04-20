import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Settings2,
  Sparkles,
  History
} from 'lucide-react';
import Link from 'next/link';
import ConsultationView from '@/components/ConsultationView';
import StructuredOutput from '@/components/StructuredOutput';
import FlagsPanel from '@/components/FlagsPanel';

// Import realistic mock data
import mockConsultation from '@/../mock/consultation.json';

export default function ConsultPage() {
  const router = useRouter();
  const { patientId } = router.query;
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');

  const {
    isRecording,
    isTranscribing,
    transcript,
    audioBlob,
    startRecording,
    stopRecording,
    transcribeAudio
  } = useVoiceRecorder();

  // Automatically transcribe when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording) {
      transcribeAudio(audioBlob, selectedLang);
    }
  }, [audioBlob, isRecording, selectedLang]);

  const handleFinalize = async () => {
    if (!transcript) {
      alert("No transcript detected. Please record a consultation first.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) throw new Error('Extraction failed');
      
      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      console.error("Finalize error:", err);
      // Fallback for demo
      setExtractedData(mockConsultation.extracted_data);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col gap-8 h-full">
      <Head>
        <title>{`Consultation | ${patientId || 'New Session'}`}</title>
      </Head>
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:border-indigo-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
              {patientId?.[0] || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-slate-900 leading-none">{mockConsultation.patient_name}</h1>
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                {patientId || 'P101'} • {mockConsultation.age}Y • {mockConsultation.gender === 'M' ? 'Male' : 'Female'} • <span className="text-indigo-500">{mockConsultation.visit_type}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/history/${patientId || 'P101'}`} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all">
            <History className="w-4 h-4" />
            View Patient History
          </Link>
          <button 
            className="sarvam-button-outline !py-3 !px-6 flex items-center gap-2 text-xs"
            onClick={() => alert("Note saved to Firestore (Mock)")}
          >
            Save Note
          </button>
          <button 
            onClick={handleFinalize}
            className="sarvam-button-primary !py-3 !px-10 flex items-center gap-2 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finalize Note
          </button>
        </div>
      </div>

      {/* Grid Layout: [4] | [5] | [3] = 12 columns Total */}
      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
        
        {/* Column 1: Voice Capture (4/12) */}
        <div className="col-span-4 flex flex-col min-h-0">
          <ConsultationView 
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            transcript={transcript}
            audioBlob={audioBlob}
            onStart={startRecording}
            onStop={stopRecording}
            selectedLang={selectedLang}
            onLangChange={setSelectedLang}
          />
        </div>

        {/* Column 2: Extracted Clinical Data (5/12) */}
        <div className="col-span-5 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
            <div className="flex items-center justify-between mb-2">
               <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Medical Summary</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time clinical extraction</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">AI Powered</span>
               </div>
            </div>

            {isProcessing ? (
              <div className="sarvam-card p-20 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/30">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structuring Clinical Data...</p>
              </div>
            ) : (
              <StructuredOutput data={extractedData} />
            )}
          </div>
        </div>

        {/* Column 3: Flags & Warnings (3/12) */}
        <div className="col-span-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Safety & Flags</h4>
          </div>
          <FlagsPanel flags={extractedData?.flags || []} />
        </div>

      </div>

      {/* Workspace Footer */}
      <div className="flex items-center justify-between py-4 border-t border-slate-100">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Settings2 className="w-3 h-3" /> System Status: Operational
         </p>
         <div className="flex gap-4">
            <span className="text-[10px] font-black text-slate-200">Session CLI-8423</span>
         </div>
      </div>

    </div>
  );
}
