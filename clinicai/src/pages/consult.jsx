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
import { getPatient } from '@/services/supabase';
import { jsPDF } from 'jspdf';

export default function ConsultPage() {
  const router = useRouter();
  const { patientId } = router.query;
  
  const { isRecording, transcript, audioBlob, startRecording, stopRecording } = useVoiceRecorder();
  
  const [liveTranscript, setLiveTranscript] = useState('');
  const [structuredData, setStructuredData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

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
        { name: suggestion.label.replace('POSSIBLE ', ''), dosage: "As per protocol", frequency: "Check guidelines", duration: "Check guidelines", flag: false }
      ],
      possible_suggestions: prev.possible_suggestions.filter(s => s.label !== suggestion.label)
    }));
  };

  const handleSave = async () => {
    try {
      await saveSession(patientId || 'P12345', structuredData);
      alert('Session saved successfully!');
      setIsEditingData(false);
    } catch (error) {
      alert('Failed to save session');
    }
  };

  const handleDownloadReport = async () => {
    if (!structuredData) return;

    setIsDownloadingReport(true);
    try {
      const resolvedPatientId = patientId || 'P12345';
      const patient = await getPatient(resolvedPatientId);

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const ensurePageSpace = (required = 10) => {
        if (y + required > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const drawDivider = () => {
        ensurePageSpace(6);
        doc.setDrawColor(210, 210, 210);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      const drawSectionHeading = (text) => {
        ensurePageSpace(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(text.toUpperCase(), margin, y);
        y += 6;
      };

      const drawBodyLine = (label, value) => {
        ensurePageSpace(6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${label}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        const wrapped = doc.splitTextToSize(value || 'N/A', contentWidth - 30);
        doc.text(wrapped, margin + 30, y);
        y += Math.max(5, wrapped.length * 4.5);
      };

      const drawSimpleTable = (headers, rows) => {
        const colWidth = contentWidth / headers.length;
        const rowHeight = 7;
        ensurePageSpace(12);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        headers.forEach((header, index) => {
          const x = margin + colWidth * index;
          doc.rect(x, y, colWidth, rowHeight);
          doc.text(header, x + 2, y + 4.7);
        });
        y += rowHeight;

        doc.setFont('helvetica', 'normal');
        rows.forEach((row) => {
          ensurePageSpace(rowHeight + 2);
          row.forEach((cell, index) => {
            const x = margin + colWidth * index;
            doc.rect(x, y, colWidth, rowHeight);
            const text = doc.splitTextToSize(String(cell || '-'), colWidth - 3);
            doc.text(text[0] || '-', x + 2, y + 4.7);
          });
          y += rowHeight;
        });
      };

      const now = new Date();
      const timestamp = now.toLocaleString();
      const dateForFile = now.toISOString().slice(0, 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('ClinicAI - Consultation Report', margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated at: ${timestamp}`, margin, y);
      y += 5;

      drawDivider();

      drawSectionHeading('Patient Info');
      drawBodyLine('Name', patient?.name || 'Unknown');
      drawBodyLine('ID', resolvedPatientId);
      drawBodyLine('Age', patient?.age ? String(patient.age) : 'Unknown');
      drawBodyLine('Gender', patient?.gender || 'Unknown');
      drawBodyLine('Blood Group', patient?.blood_group || 'Unknown');
      drawBodyLine('Contact', patient?.contact || 'Unknown');

      drawDivider();

      drawSectionHeading('Chief Complaint');
      drawBodyLine('Complaint', structuredData.chief_complaint || 'N/A');

      drawSectionHeading('Symptoms');
      const symptomRows = (structuredData.symptoms || []).map((item) => {
        if (typeof item === 'string') {
          return [item, structuredData.duration || '-', '-'];
        }
        return [item.symptom || item.name || '-', item.duration || structuredData.duration || '-', item.severity || '-'];
      });
      drawSimpleTable(['Symptom', 'Duration', 'Severity'], symptomRows.length ? symptomRows : [['-', '-', '-']]);

      drawSectionHeading('Diagnosis');
      drawBodyLine('Diagnosis', structuredData.diagnosis || 'N/A');

      drawSectionHeading('Medications');
      const medicationRows = (structuredData.medications || []).map((med) => [
        med.name || '-',
        med.dosage || '-',
        med.frequency || '-',
        med.duration || '-',
      ]);
      drawSimpleTable(
        ['Name', 'Dosage', 'Frequency', 'Duration'],
        medicationRows.length ? medicationRows : [['-', '-', '-', '-']]
      );

      drawSectionHeading('Follow-up');
      drawBodyLine('Plan', structuredData.follow_up || 'N/A');

      drawSectionHeading('AI Flags');
      const flags = structuredData.flags || [];
      if (!flags.length) {
        drawBodyLine('Status', 'No active warnings');
      } else {
        flags.forEach((flag) => {
          ensurePageSpace(6);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          const wrappedFlag = doc.splitTextToSize(`⚠ ${flag}`, contentWidth);
          doc.text(wrappedFlag, margin, y);
          y += wrappedFlag.length * 4.5;
        });
      }

      drawSectionHeading('Confidence');
      drawBodyLine('Score', structuredData.confidence || 'N/A');

      ensurePageSpace(14);
      y = Math.max(y, pageHeight - margin - 12);
      doc.setDrawColor(210, 210, 210);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated by ClinicAI | ${dateForFile} | Doctor's Signature: ___________`, margin, y);

      doc.save(`ClinicAI_Report_${resolvedPatientId}_${dateForFile}.pdf`);
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Failed to generate report');
    } finally {
      setIsDownloadingReport(false);
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
            disabled={!structuredData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
          >
            Save Session
          </button>
          {structuredData && (
            <button
              onClick={handleDownloadReport}
              disabled={isDownloadingReport}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50 flex items-center"
            >
              <span className="mr-2">📄</span>
              {isDownloadingReport ? 'Generating...' : 'Download Report'}
            </button>
          )}
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
