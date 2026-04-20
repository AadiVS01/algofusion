import React from 'react';

export default function StructuredOutput({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Diagnosis & Complaint</h3>
        <div className="mb-4">
          <label className="text-xs text-gray-500 font-medium">Chief Complaint</label>
          <p className="text-lg font-semibold text-gray-800">{data.chief_complaint}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Diagnosis</label>
          <p className="text-lg font-semibold text-green-700">{data.diagnosis}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Medications</h3>
        <div className="space-y-3">
          {data.medications?.map((med, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${med.flag ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex justify-between items-start">
                <span className="font-bold text-gray-800">{med.name}</span>
                {med.flag && <span className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] font-bold rounded uppercase">Flagged</span>}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {med.dosage} • {med.frequency} • {med.timing && <span className="font-bold text-indigo-500">{med.timing}</span>} • {med.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Possible AI Suggestions */}
      {data.possible_suggestions && data.possible_suggestions.length > 0 && (
        <div className="col-span-1 md:col-span-2 bg-yellow-50 p-6 rounded-2xl border border-yellow-100 mt-4">
          <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-widest mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Possible Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.possible_suggestions.map((sug, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-yellow-200 shadow-sm flex justify-between items-center group hover:border-yellow-400 transition-all">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-gray-800 italic">
                    <span className="text-yellow-600 font-black uppercase tracking-tighter mr-1">Possible</span> {sug.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium italic">{sug.reason}</p>
                </div>
                <button 
                  onClick={() => data.onAddSuggestion?.(sug)}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-2 rounded-lg transition-colors"
                  title="Add to Prescription"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
