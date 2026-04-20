import React from 'react';

export default function PatientHistory({ sessions }) {
  if (!sessions || sessions.length === 0) return (
    <div className="bg-white p-8 text-center rounded-xl border border-gray-100">
      <p className="text-gray-500 italic">No past sessions found for this patient.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {sessions.map((session, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{session.date}</span>
              <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {session.diagnosis}
              </h4>
            </div>
            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full">
              Session #{session.session_id}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{session.summary}</p>
          <div className="flex flex-wrap gap-2">
            {session.medications?.map((med, midx) => (
              <span key={midx} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-medium rounded uppercase">
                {med}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
