import React from 'react';

export default function FlagsPanel({ flags }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="mt-6 bg-red-50 border border-red-100 p-4 rounded-xl">
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Documentation Flags</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {flags.map((flag, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1 bg-white border border-red-200 text-red-700 text-xs font-medium rounded-full shadow-sm"
          >
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}
