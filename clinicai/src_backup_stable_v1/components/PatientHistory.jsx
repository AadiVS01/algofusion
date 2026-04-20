import React from 'react';

export default function PatientHistory({ sessions }) {
  const [expandedId, setExpandedId] = React.useState(null);

  if (!sessions || sessions.length === 0) return (
    <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">No past sessions found for this patient.</p>
    </div>
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
      {sessions.map((session, idx) => {
        const isExpanded = expandedId === session.id;
        const mainLabel = session.diagnosis || 
                         session.extracted_data?.chief_complaint || 
                         (session.extracted_data?.symptoms && session.extracted_data.symptoms[0]) ||
                         "Clinical Session";

        return (
          <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Timeline Dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors ${
              isExpanded ? 'bg-indigo-600 text-white' : 'bg-white text-gray-300'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isExpanded ? 'bg-white' : 'bg-gray-200'}`}></div>
            </div>

            {/* Content Card */}
            <div 
              onClick={() => toggleExpand(session.id)}
              className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border transition-all cursor-pointer ${
                isExpanded ? 'ring-2 ring-indigo-500 border-transparent shadow-xl' : 'border-gray-100 shadow-sm hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between space-x-2 mb-3">
                <div className="font-bold text-indigo-600 text-[10px] uppercase tracking-widest">
                  {formatDate(session.created_at)}
                </div>
                <time className="font-mono text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded">
                  #{session.id?.slice(0, 8).toUpperCase()}
                </time>
              </div>
              
              <div className="text-xl font-black text-gray-900 leading-tight mb-2 flex items-center justify-between">
                <span className="capitalize">{mainLabel}</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {!isExpanded && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {session.medications?.slice(0, 2).map((med, midx) => (
                    <span key={midx} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                      {typeof med === 'object' ? med.name : med}
                    </span>
                  ))}
                  {session.medications?.length > 2 && (
                    <span className="text-[10px] text-gray-400 font-bold self-center">+{session.medications.length - 2} more</span>
                  )}
                </div>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-6 animate-fadeIn">
                  {/* Detailed Prescription Table */}
                  <div className="overflow-hidden bg-gray-50 rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100/50">
                          <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase">Drug Name</th>
                          <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase">Dosage</th>
                          <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase">Schedule</th>
                          <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {session.medications?.map((med, midx) => (
                          <tr key={midx} className="hover:bg-white transition-colors">
                            <td className="px-4 py-3 text-xs font-bold text-gray-800">{typeof med === 'object' ? med.name : med}</td>
                            <td className="px-4 py-3 text-xs text-gray-600">{typeof med === 'object' ? med.dosage || '-' : '-'}</td>
                            <td className="px-4 py-3 text-xs">
                              <div className="text-gray-800 font-medium">{typeof med === 'object' ? med.frequency : '-'}</div>
                              <div className="text-[10px] text-indigo-500 font-bold">{typeof med === 'object' ? med.timing : ''}</div>
                            </td>
                            <td className="px-4 py-3 text-xs font-medium text-gray-600">{typeof med === 'object' ? med.duration || '-' : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!session.medications || session.medications.length === 0) && (
                      <p className="p-4 text-xs italic text-gray-400 text-center">No medications recorded for this visit.</p>
                    )}
                  </div>

                  {/* Symptoms & Notes */}
                  {session.extracted_data?.symptoms && (
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observed Symptoms</h5>
                      <div className="flex flex-wrap gap-2">
                        {session.extracted_data.symptoms.map((s, si) => (
                          <span key={si} className="bg-white border border-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 font-medium shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary / Notes */}
                  {session.summary && (
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultation Summary</h5>
                      <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/30 p-4 rounded-xl border border-indigo-50">
                        {session.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
