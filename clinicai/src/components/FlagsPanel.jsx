import React from 'react';

export default function FlagsPanel({ flags }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="bg-black p-6 border-[0.5px] border-black">
      <div className="flex items-center space-x-2 mb-6">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Clinical Alerts</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {flags.map((flag, idx) => (
          <div 
            key={idx} 
            className="border-[0.5px] border-white text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-default"
          >
            {flag}
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-gray-500 mt-6 font-light uppercase tracking-widest leading-loose">
        Note: Alerts are AI-detected. Please verify against ICMR Pharmacopeia standards.
      </p>
    </div>
  );
}
