import { AlertCircle, Info, HelpCircle } from 'lucide-react';

export default function FlagsPanel({ flags = [] }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="sarvam-card p-6 flex flex-col items-center justify-center text-center opacity-60">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
          <Info className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Flags Detected</p>
        <p className="text-[10px] text-slate-400 mt-1">Clinical documentation is comprehensive.</p>
      </div>
    );
  }

  return (
    <div className="sarvam-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#131313]">Attention Required</h3>
        <span className="ml-auto bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full">
          {flags.length} {flags.length === 1 ? 'FLAG' : 'FLAGS'}
        </span>
      </div>

      <div className="space-y-3">
        {flags.map((flag, index) => (
          <div key={index} className="flex gap-3 p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl group hover:bg-amber-100/40 transition-colors">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-900 leading-relaxed">
              {flag}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 leading-relaxed italic">
          These flags highlight missing details or unclear verbal references in the current session.
        </p>
      </div>
    </div>
  );
}
