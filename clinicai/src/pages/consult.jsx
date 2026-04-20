import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ConsultationView from '@/components/ConsultationView';
import StructuredOutput from '@/components/StructuredOutput';
import FlagsPanel from '@/components/FlagsPanel';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { transcribeAudio, extractStructured, saveSession } from '../../contract';

export default function ConsultPage() {
  const router = useRouter();
  const { patientId } = router.query;
  
  const { isRecording, transcript, audioBlob, startRecording, stopRecording } = useVoiceRecorder();
  
  const [liveTranscript, setLiveTranscript] = useState('');
  const [structuredData, setStructuredData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync live transcript from hook
  useEffect(() => {
    if (transcript) setLiveTranscript(transcript);
  }, [transcript]);

  // Trigger AI Pipeline when audio is ready
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleProcessAudio(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const handleProcessAudio = async (blob) => {
    setIsProcessing(true);
    try {
      // 1. Transcribe (Proxy to Sarvam)
      const transResult = await transcribeAudio(blob);
      const finalTranscript = transResult.transcript || liveTranscript;
      setLiveTranscript(finalTranscript);

      // 2. Extract (Hybrid RAG: Pinecone + Supabase)
      const clinicalData = await extractStructured(finalTranscript, patientId || 'P12345');
      setStructuredData(clinicalData);
    } catch (error) {
      console.error('AI Pipeline Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    setStructuredData(prev => ({
      ...prev,
      medications: [
        ...(prev.medications || []),
        { name: suggestion.label.replace('POSSIBLE ', ''), dosage: "As per protocol", frequency: "Check guidelines", duration: "Check guidelines", flag: false }
      ],
      possible_suggestions: prev.possible_suggestions.filter(s => s.label !== suggestion.label)
    }));
  };

  const handleSave = async () => {
    try {
      await saveSession(patientId || 'P12345', structuredData);
      alert('Session saved successfully!');
    } catch (error) {
      alert('Failed to save session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>ClinicAI | Consultation</title>
      </Head>

      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Active Consultation</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Patient: <span className="text-indigo-600">{patientId || 'P12345'}</span> • Ramesh Patil</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={!structuredData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
          >
            Save Session
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8 space-y-8">
        <section className="space-y-6">
          <ConsultationView 
            isRecording={isRecording} 
            startRecording={startRecording} 
            stopRecording={stopRecording} 
            transcript={liveTranscript} 
          />
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                <p className="text-gray-600">{isRecording ? 'Recording and analyzing...' : 'Standby'}</p>
              </div>
              {isProcessing && (
                <div className="flex items-center space-x-2 text-sm text-indigo-600 font-bold">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AI Orchestration in progress...</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {structuredData && (
          <section className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-indigo-900 tracking-tight">Structured Clinical Output</h3>
                <p className="text-sm text-indigo-600 mt-1 font-medium">Auto-extracted from consultation audio</p>
              </div>
              <span className={`px-4 py-1.5 text-xs font-black uppercase rounded-full shadow-sm ${
                structuredData.confidence === 'high' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {structuredData.confidence} Confidence
              </span>
            </div>
            
            <StructuredOutput data={{...structuredData, onAddSuggestion: handleAddSuggestion}} />
            
            <div className="pt-4 border-t border-indigo-100">
              <FlagsPanel flags={structuredData.flags} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
