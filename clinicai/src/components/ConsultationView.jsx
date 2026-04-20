import { Mic, Square, Activity, Volume2, Globe, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ConsultationView({ 
  isRecording, 
  isTranscribing,
  transcript,
  audioBlob,
  onStart, 
  onStop,
  selectedLang,
  onLangChange
}) {
  const scrollRef = useRef(null);

  const languages = [
    { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
    { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
    { code: 'en-IN', label: 'English', native: 'English' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [transcript]);

  return (
    <section className="sarvam-card p-8 flex flex-col h-full min-h-[700px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#131313] tracking-tight">Audio Capture</h3>
          <p className="text-slate-500 text-xs mt-1 font-medium">Capture clinical session in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full animate-pulse border border-red-100">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Recording</span>
            </div>
          )}
          
          <button 
            onClick={isRecording ? onStop : onStart}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl
              ${isRecording 
                ? 'bg-red-500 text-white shadow-red-200 rotate-90 scale-110' 
                : 'sarvam-button-primary !w-14 !h-14 !p-0 shadow-indigo-100'}`}
          >
            {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Improved Language Switcher Bar */}
      <div className="flex items-center gap-4 mb-8 bg-slate-50/50 p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <Globe className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
           {languages.map(lang => (
             <button 
              key={lang.code}
              onClick={() => onLangChange(lang.code)}
              className={`px-5 py-2 whitespace-nowrap rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${selectedLang === lang.code 
                  ? 'bg-[#131313] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'}`}
             >
               {lang.native}
             </button>
           ))}
        </div>
      </div>

      {/* Visualizer & Transcript Container */}
      <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col overflow-hidden relative shadow-inner-soft">
        {/* Mock Waveform / Status */}
        <div className="flex items-center justify-center gap-1.5 mb-10 h-10 px-4">
          {isRecording ? (
            Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="waveform-bar !bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.2)]" 
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  opacity: Math.random() * 0.4 + 0.6,
                  width: '3px'
                }}
              />
            ))
          ) : (
            <div className="flex items-center gap-3 text-slate-300">
              <Volume2 className="w-4 h-4" />
              <div className="h-[1px] w-48 bg-slate-200"></div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6 px-1">
          <div className={`p-1.5 rounded-lg border ${isRecording || isTranscribing ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200'}`}>
            <Activity className={`w-3.5 h-3.5 ${isRecording || isTranscribing ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
            {isTranscribing ? 'AI Clinical Translation' : 'Sovereign Clinical Transcript'}
          </h4>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4"
        >
          {isTranscribing ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-500 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-bounce" />
               </div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-[300px]">
                  Sarvam AI is translating Indic speech to clinical English...
               </p>
            </div>
          ) : transcript ? (
            <p className="text-[#131313] text-xl font-serif leading-[1.8] font-bold whitespace-pre-wrap tracking-tight">
              {transcript}
              {isRecording && <span className="inline-block w-2 h-7 bg-indigo-500 ml-2 animate-pulse translate-y-1 rounded-sm shadow-[0_0_8px_rgba(79,70,229,0.4)]"></span>}
            </p>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <p className="text-sm font-bold text-slate-400">Ready to listen...</p>
              <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Tap the microphone to start transcribing the clinical notes.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sarvam AI Powered</p>
         </div>
         <p className="text-[10px] font-bold text-slate-400">v1.2.4</p>
      </div>
    </section>
  );
}
