import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [patientId, setPatientId] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>ClinicAI | Patient Lookup</title>
      </Head>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-indigo-50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">ClinicAI</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium italic">Empowering doctor-patient conversations</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Patient Identifier
            </label>
            <input
              type="text"
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter ID (e.g. P12345)"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-lg font-medium outline-none text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <Link 
              href={`/consult?patientId=${patientId}`}
              className={`text-center py-4 rounded-2xl font-bold text-white transition-all shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
                patientId ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800' : 'bg-gray-300 cursor-not-allowed'
              }`}
              onClick={(e) => !patientId && e.preventDefault()}
            >
              Start Consultation
            </Link>
            
            <Link 
              href={`/history/${patientId}`}
              className={`text-center py-4 rounded-2xl font-bold transition-all border-2 transform hover:-translate-y-0.5 active:translate-y-0 ${
                patientId ? 'text-indigo-600 border-indigo-600 hover:bg-indigo-50 active:bg-indigo-100' : 'text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              onClick={(e) => !patientId && e.preventDefault()}
            >
              View History
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center space-x-6">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Quick Start</p>
            <button 
              onClick={() => setPatientId('P12345')}
              className="text-xs text-indigo-500 font-semibold hover:underline"
            >
              Use Mock Patient (P12345)
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest">
        Voice-Driven Clinic 9-Hour Sprint Edition
      </p>
    </div>
  );
}
