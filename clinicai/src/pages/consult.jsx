import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ConsultationView from '@/components/ConsultationView';
import StructuredOutput from '@/components/StructuredOutput';
import FlagsPanel from '@/components/FlagsPanel';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import RAGChatbot from '@/components/RAGChatbot';
import { transcribeAudio, extractStructured, saveSession } from '../../contract';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ConsultPage() {
  const router = useRouter();
  const { patientId } = router.query;
  
  const { isRecording, transcript, audioBlob, startRecording, stopRecording } = useVoiceRecorder();
  
  const [liveTranscript, setLiveTranscript] = useState('');
  const [structuredData, setStructuredData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleUpdateData = (newData) => {
    setStructuredData(newData);
  };

  const handleRemoveMed = (idx) => {
    setStructuredData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== idx)
    }));
  };

  const handleAddMed = () => {
    setStructuredData(prev => ({
      ...prev,
      medications: [
        ...(prev.medications || []),
        { name: '', dosage: '', frequency: '', timing: '', duration: '', flag: false }
      ]
    }));
  };

  const handleAddSuggestion = (suggestion) => {
    setStructuredData(prev => ({
      ...prev,
      medications: [
        ...(prev.medications || []),
        { name: suggestion.label, dosage: "As per protocol", frequency: "Check guidelines", duration: "Check guidelines", flag: false }
      ],
      possible_suggestions: prev.possible_suggestions.filter(s => s.label !== suggestion.label)
    }));
  };

  const handleSave = async () => {
    try {
      await saveSession(patientId || 'P12345', structuredData);
      setIsSaved(true);
      alert('Session saved successfully!');
      setIsEditingData(false);
    } catch (error) {
      alert('Failed to save session');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CLINIC AI | MEDICAL PRESCRIPTION", 14, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 14, 30);
    doc.text(`Patient ID: ${patientId || 'P12345'}`, 14, 35);
    
    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(14, 40, 196, 40);
    
    // Clinical Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Chief Complaint:", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text(structuredData.chief_complaint || "N/A", 60, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis:", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.text(structuredData.diagnosis || "N/A", 60, 60);
    
    // Medications Table
    if (structuredData.medications && structuredData.medications.length > 0) {
      doc.text("Medications:", 14, 75);
      autoTable(doc, {
        startY: 80,
        head: [['Medicine', 'Dosage', 'Frequency', 'Timing', 'Duration']],
        body: structuredData.medications.map(m => [
          m.name, m.dosage, m.frequency, m.timing, m.duration
        ]),
        theme: 'striped',
        headStyles: { fillStyle: 'black', fillColor: [0, 0, 0] },
      });
    }
    
    // Footer / Follow up
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 100;
    doc.setFont("helvetica", "bold");
    doc.text("Follow up / Advice:", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(structuredData.follow_up || "General rest and hydration.", 14, finalY + 10, { maxWidth: 180 });
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("e-Signed by ClinicAI Orchestrator", 14, 280);
    
    doc.save(`Prescription_${patientId || 'Patient'}_${new Date().getTime()}.pdf`);
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
          {isSaved && (
            <button 
              onClick={generatePDF}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PDF</span>
            </button>
          )}
          {structuredData && (
            <button 
              onClick={() => setIsEditingData(!isEditingData)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isEditingData ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditingData ? 'Finish Editing' : 'Edit Findings'}
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!structuredData || isSaved}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
          >
            {isSaved ? 'Session Archived' : 'Save Session'}
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Consultation */}
        <div className="lg:col-span-2 space-y-8">
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
              
              <StructuredOutput 
                data={{...structuredData, onAddSuggestion: handleAddSuggestion}} 
                isEditing={isEditingData}
                onUpdate={handleUpdateData}
                onRemoveMed={handleRemoveMed}
                onAddMed={handleAddMed}
              />
              
              <div className="pt-4 border-t border-indigo-100">
                <FlagsPanel flags={structuredData.flags} />
              </div>
            </section>
          )}
        </div>

        {/* Right Column: RAG Assistant */}
        <aside className="lg:col-span-1 border-l border-gray-100 pl-0 lg:pl-4">
          <div className="sticky top-24">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Patient Brain (RAG)</h4>
            <RAGChatbot patientId={patientId || 'P12345'} />
          </div>
        </aside>
      </main>
    </div>
  );
}
