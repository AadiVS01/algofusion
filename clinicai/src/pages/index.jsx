import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Stethoscope, Search, ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [patientId, setPatientId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleStart = (e) => {
    e.preventDefault();
    if (patientId.trim()) {
      setIsScanning(true);
      setTimeout(() => {
        router.push(`/consult?patientId=${patientId}`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#fdfdfd]">
      <Head>
        <title>ClinicAI | Sovereign Clinical OS</title>
      </Head>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Brand & Promo */}
        <div className="space-y-8">
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/20">
            <Stethoscope className="text-white w-8 h-8" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-serif font-bold text-[#131313] leading-tight">
              Clinical Intelligence <br /> 
              <span className="text-primary tracking-tight">Decoded by Voice.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
              The next-generation voice DOCUMENTATION tool for modern healthcare heroes.
            </p>
          </div>
          
          <div className="flex items-center gap-10 pt-4">
             <div className="space-y-1">
                <p className="text-2xl font-bold text-[#131313]">1.2k+</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Doctors</p>
             </div>
             <div className="w-[1px] h-10 bg-slate-100"></div>
             <div className="space-y-1">
                <p className="text-2xl font-bold text-[#131313]">98%</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NER Accuracy</p>
             </div>
          </div>
        </div>

        {/* Right: Lookup Card */}
        <div className="sarvam-card p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <ShieldCheck className="w-5 h-5 text-indigo-500" />
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Patient Lookup</h2>
            </div>

            <form onSubmit={handleStart} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">PATIENT IDENTIFIER (ID)</label>
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 px-16 py-5 rounded-2xl text-lg font-serif font-bold focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all placeholder:text-slate-200"
                    placeholder="e.g. P12345"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isScanning}
                className={`w-full sarvam-button-primary flex items-center justify-center gap-3 text-lg py-5 relative overflow-hidden transition-all
                  ${isScanning ? 'opacity-90 cursor-wait' : ''}`}
              >
                {isScanning ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    <Activity className="w-5 h-5 animate-pulse" />
                    Scanning Vault...
                  </>
                ) : (
                  <>
                    Start New Consultation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50">
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Quick Shortcuts</p>
               <div className="flex gap-3">
                  {['P101', 'P102', 'P103'].map(id => (
                    <button 
                      key={id} 
                      onClick={() => setPatientId(id)}
                      className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all"
                    >
                      {id}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
