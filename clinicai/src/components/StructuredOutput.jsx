import React from 'react';

export default function StructuredOutput({ data, isEditing, onUpdate, onRemoveMed, onAddMed }) {
  if (!data) return null;

  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleMedChange = (idx, field, value) => {
    const newMeds = [...data.medications];
    newMeds[idx] = { ...newMeds[idx], [field]: value };
    onUpdate({ ...data, medications: newMeds });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[0.5px] border-black bg-white">
      {/* Section I: Findings */}
      <div className="p-8 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-black space-y-8">
        <div>
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Section I: Findings</h3>
          
          <div className="mb-8">
            <label className="text-[11px] font-black uppercase text-black mb-2 block">Chief Complaint</label>
            {isEditing ? (
              <input 
                type="text" 
                value={data.chief_complaint || ''} 
                onChange={(e) => handleChange('chief_complaint', e.target.value)}
                className="w-full bg-white border-b border-black py-2 text-3xl font-light focus:outline-none tracking-tight"
              />
            ) : (
              <p className="text-3xl font-black text-black leading-none tracking-tighter">{data.chief_complaint}</p>
            )}
          </div>
          
          <div className="mb-8">
            <label className="text-[11px] font-black uppercase text-black mb-2 block">Clinical Diagnosis</label>
            {isEditing ? (
              <textarea 
                value={data.diagnosis || ''} 
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                className="w-full bg-white border border-black p-4 text-xl font-light focus:outline-none min-h-[160px] leading-relaxed"
              />
            ) : (
              <p className="text-xl font-light text-black leading-relaxed tracking-tight">{data.diagnosis}</p>
            )}
          </div>

          {/* New: Follow-up Edit in Findings Column */}
          <div>
            <label className="text-[11px] font-black uppercase text-black mb-2 block">Follow-up / Advice</label>
            {isEditing ? (
              <textarea 
                value={data.follow_up || ''} 
                onChange={(e) => handleChange('follow_up', e.target.value)}
                placeholder="Enter follow-up instructions..."
                className="w-full bg-white border-b border-black py-2 text-sm font-light focus:outline-none tracking-tight min-h-[80px]"
              />
            ) : (
              <p className="text-sm font-light text-black leading-relaxed italic">{data.follow_up || "General rest and hydration advised."}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section II: Prescription */}
      <div className="p-8 space-y-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Section II: Prescription</h3>
          {isEditing && (
            <button 
              onClick={onAddMed}
              className="text-[11px] bg-black text-white px-3 py-1 font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              + New Entry
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          {data.medications?.map((med, idx) => (
            <div key={idx} className="pb-8 border-b-[0.5px] border-gray-100 last:border-0 relative group">
              {isEditing && (
                <button 
                  onClick={() => onRemoveMed(idx)}
                  className="absolute -top-1 -right-1 bg-black text-white w-5 h-5 text-[12px] flex items-center justify-center hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  &times;
                </button>
              )}
              
              <div className="flex flex-col space-y-3">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <input 
                        type="text" 
                        value={med.name || ''} 
                        placeholder="Medication Name"
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        className="flex-1 bg-white border-b border-black text-lg font-black p-1 outline-none"
                      />
                      <button 
                        onClick={() => handleMedChange(idx, 'flag', !med.flag)}
                        className={`text-[9px] px-2 py-1 font-black border ${med.flag ? 'bg-black text-white' : 'bg-white text-black'}`}
                      >
                        {med.flag ? 'FLAGGED' : 'FLAG'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-gray-400">Dosage</span>
                        <input 
                          type="text" 
                          value={med.dosage || ''} 
                          placeholder="E.g. 500mg"
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                          className="w-full bg-white border-b border-gray-200 text-sm p-1 outline-none font-light"
                        />
                      </div>
                      <div className="space-y-1">
                         <span className="text-[8px] font-black uppercase text-gray-400">Frequency</span>
                        <input 
                          type="text" 
                          value={med.frequency || ''} 
                          placeholder="E.g. Twice a day"
                          onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                          className="w-full bg-white border-b border-gray-200 text-sm p-1 outline-none font-light"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-gray-400">Timing</span>
                        <input 
                          type="text" 
                          value={med.timing || ''} 
                          placeholder="E.g. After Lunch"
                          onChange={(e) => handleMedChange(idx, 'timing', e.target.value)}
                          className="w-full bg-white border-b border-gray-200 text-sm p-1 outline-none font-light"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase text-gray-400">Duration</span>
                        <input 
                          type="text" 
                          value={med.duration || ''} 
                          placeholder="E.g. 5 Days"
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                          className="w-full bg-white border-b border-gray-200 text-sm p-1 outline-none font-light"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-black text-black uppercase tracking-tight text-lg">{med.name}</span>
                      {med.flag && <span className="text-[10px] font-black underline decoration-2">FLAGGED</span>}
                    </div>
                    <div className="text-[11px] font-light text-gray-500 tracking-wide uppercase">
                      {med.dosage} • {med.frequency} • {med.timing && <span className="text-black font-black">{med.timing}</span>} • {med.duration}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {(!data.medications || data.medications.length === 0) && (
            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest py-8 border-[0.5px] border-dashed border-gray-300">Prescription Empty</p>
          )}
        </div>
      </div>

      {/* Section III: Alternatives */}
      {data.possible_suggestions && data.possible_suggestions.length > 0 && (
        <div className="col-span-1 md:col-span-2 border-t-[0.5px] border-black p-8 bg-gray-50">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center">
            Section III: Pharmacological Alternatives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.possible_suggestions.map((sug, idx) => (
              <div key={idx} className="flex justify-between items-start group">
                <div className="flex-1 pr-6 border-l-[3px] border-black pl-4">
                  <p className="text-lg font-black text-black leading-tight uppercase tracking-tighter">
                    {sug.label}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 font-light leading-relaxed italic antialiased">{sug.reason}</p>
                </div>
                <button 
                  onClick={() => data.onAddSuggestion?.(sug)}
                  className="bg-black text-white p-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
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
