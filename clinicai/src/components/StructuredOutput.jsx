import { 
  ClipboardList, 
  Stethoscope, 
  Pill, 
  Calendar, 
  Copy, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function StructuredOutput({ data }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Safe defaults if data is missing
  const displayData = data || {
    chief_complaint: "No data extracted yet.",
    symptoms: [],
    diagnosis: "Pending evaluation.",
    medications: [],
    follow_up: "N/A"
  };

  const sections = [
    { 
      id: 'cc', 
      title: 'Chief Complaint', 
      icon: ClipboardList, 
      content: displayData.chief_complaint, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      id: 'diagnosis', 
      title: 'Diagnosis', 
      icon: Stethoscope, 
      content: displayData.diagnosis, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      id: 'followup', 
      title: 'Follow-up Plan', 
      icon: Calendar, 
      content: displayData.follow_up, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Insights Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="sarvam-card p-6 group hover:border-indigo-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center ${section.color}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{section.title}</h4>
              </div>
              <button 
                onClick={() => handleCopy(section.content, section.id)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-indigo-600 transition-colors"
              >
                {copied === section.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[#131313] font-serif font-bold text-lg leading-snug">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Symptoms Cloud */}
      <div className="sarvam-card p-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Detected Symptoms</h4>
        <div className="flex flex-wrap gap-2">
          {displayData.symptoms.length > 0 ? displayData.symptoms.map((s, i) => (
            <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold border border-slate-100">
              {s}
            </span>
          )) : (
            <p className="text-xs text-slate-400 italic">No symptoms identified.</p>
          )}
        </div>
      </div>

      {/* Medications Table */}
      <div className="sarvam-card overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prescribed Medications</h4>
        </div>
        <div className="divide-y divide-slate-50">
          {displayData.medications.length > 0 ? displayData.medications.map((m, i) => (
            <div key={i} className="p-6 flex items-start justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl ${m.flag ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center shrink-0`}>
                   {m.flag ? <AlertCircle className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${m.flag ? 'text-red-700' : 'text-[#131313]'}`}>{m.name}</p>
                    {m.flag && <span className="bg-red-100 text-red-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Unclear</span>}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{m.frequency} • {m.duration}</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                {m.dosage}
              </span>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              No medications listed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
