import { Calendar, ChevronRight, Activity, FileText, Pill } from 'lucide-react';
import Link from 'next/link';

export default function PatientHistory({ patientId, sessions = [] }) {
  // Use provided sessions or empty array fallback
  const displaySessions = (sessions && sessions.length > 0) ? sessions : [
    {
      id: 'S003',
      date: 'April 10, 2026',
      diagnosis: 'Knee Pain (Right)',
      summary: 'Mild swelling in right knee after exercise. Prescribed Ibuprofen 200mg.',
      tags: ['Ortho', 'Follow-up']
    },
    {
      id: 'S002',
      date: 'March 25, 2026',
      diagnosis: 'Indigestion',
      summary: 'Patient complained of stomach ache after travel. Rec: Pantoprazole.',
      tags: ['Gastric']
    },
    {
      id: 'S001',
      date: 'March 10, 2026',
      diagnosis: 'Common Cold',
      summary: 'Patient had mild congestion and throat pain. Advised rest.',
      tags: ['Primary Care']
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-xl font-serif font-bold text-[#131313] tracking-tight">Visit Timeline</h3>
         <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {displaySessions.length} RECORDS
         </div>
      </div>

      <div className="relative space-y-8">
        {/* Timeline Connecting Line */}
        <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-slate-100"></div>

        {displaySessions.map((session, index) => (
          <div key={session.id} className="relative pl-14 group">
            
            {/* Timeline Dot */}
            <div className={`absolute left-0 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-200 group-hover:shadow-indigo-100/50`}>
               <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
               </div>
            </div>

            <div className="sarvam-card p-6 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.date}</p>
                 <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
              </div>
              <h4 className="font-bold text-[#131313] mb-2">{session.diagnosis}</h4>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium mb-4">
                {session.summary}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {session.tags?.map(tag => (
                   <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-tighter rounded-md border border-slate-100">
                      #{tag}
                   </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {typeof window !== 'undefined' && sessionStorage.length === 0 && (
         <div className="text-center p-12 border-2 border-dashed border-slate-100 rounded-[2rem] opacity-40">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of History</p>
         </div>
      )}
    </div>
  );
}
