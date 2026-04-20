import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PatientHistory from '@/components/PatientHistory';
import RAGChatbot from '@/components/RAGChatbot';

export default function HistoryPage() {
  const router = useRouter();
  const { patientId } = router.query;
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetch(`/api/sessions?patientId=${patientId}`)
        .then(res => res.json())
        .then(data => {
          setSessions(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching history:", err);
          setIsLoading(false);
        });
    }
  }, [patientId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>ClinicAI | Patient History</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Longitudinal History</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Patient: <span className="text-indigo-600">{patientId || 'P12345'}</span> • Ramesh Patil</p>
          </div>
        </div>
        <div>
          <Link 
            href={`/consult?patientId=${patientId || 'P12345'}`}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 transform hover:-translate-y-0.5"
          >
            New Consultation
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Session Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Visit Timeline</h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg shadow-sm">All Time</span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-gray-400 text-xs font-semibold rounded-lg shadow-sm">Filters</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <PatientHistory sessions={sessions} />
          )}
        </div>

        {/* Right: AI RAG Assistant */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24">
            <div className="mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">AI Insights</h2>
              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">Query patient history naturally</p>
            </div>
            <RAGChatbot patientId={patientId || 'P12345'} />
            
            <div className="mt-6 bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Doctor Assist Tip</p>
                  <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                    This patient had persistent INDIGESTION in March. Check if the current FEVER is related to any GI symptoms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
