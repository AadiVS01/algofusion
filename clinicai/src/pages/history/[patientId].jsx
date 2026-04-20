import { useRouter } from 'next/router';
import Head from 'next/head';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  ChevronLeft, 
  ShieldCheck, 
  History, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import PatientHistory from '@/components/PatientHistory';
import RAGChatbot from '@/components/RAGChatbot';

// Mock data for patient header
import mockConsultation from '@/../mock/consultation.json';

export default function PatientHistoryPage() {
  const router = useRouter();
  const { patientId } = router.query;

  const handleExport = () => {
    const doc = new jsPDF();
    
    // 1. Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("ClinicAI", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // 2. Patient Subject Area
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, 182, 35, 3, 3, 'FD');
    
    doc.setFontSize(14);
    doc.setTextColor(19, 19, 19);
    doc.text(`Patient: ${mockConsultation.patient_name}`, 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Patient ID: ${patientId || 'P12345'}`, 20, 58);
    doc.text(`Age: ${mockConsultation.age}Y | Gender: ${mockConsultation.gender === 'M' ? 'Male' : 'Female'}`, 20, 64);
    
    // 3. Clinical Summary Title
    doc.setFontSize(14);
    doc.setTextColor(19, 19, 19);
    doc.text("Full Clinical Timeline", 14, 90);
    
    // 4. Detailed History Table
    const tableData = [
      ['April 10, 2026', 'Knee Pain (Right)', 'Mild swelling in right knee after exercise. Prescribed Ibuprofen 200mg.'],
      ['March 25, 2026', 'Indigestion', 'Patient complained of stomach ache after travel. Rec: Pantoprazole.'],
      ['March 10, 2026', 'Common Cold', 'Patient had mild congestion and throat pain. Advised rest.']
    ];

    autoTable(doc, {
      startY: 95,
      head: [['Date', 'Internal Diagnosis', 'Clinical Summary']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], fontSize: 10 },
      bodyStyles: { fontSize: 9, cellPadding: 5 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
    
    // 5. Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`ClinicAI Clinical OS - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`Clinical_Record_${patientId || 'P12345'}.pdf`);
    alert("Professional EMR PDF exported successfully!");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 p-10 bg-[#fdfdfd]">
      <Head>
        <title>{`Patient History | ${patientId || 'Details'}`}</title>
      </Head>
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:border-indigo-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-100/50">
              {patientId?.[0] || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-slate-900 leading-none">{mockConsultation.patient_name}</h1>
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                <span>{patientId || 'P12345'}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span>{mockConsultation.age}Y • {mockConsultation.gender === 'M' ? 'Male' : 'Female'}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                <span className="text-indigo-600 font-black">History Records</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             className="sarvam-button-outline !px-6 !py-2.5 flex items-center gap-2 text-xs"
             onClick={handleShare}
           >
              <Share2 className="w-4 h-4" /> Share
           </button>
            <button 
              className="sarvam-button-primary !px-8 !py-2.5 flex items-center gap-2 text-xs shadow-lg shadow-indigo-100/50"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" /> Export EMR
            </button>
        </div>
      </div>

      {/* Dynamic Grid: Timeline (4) | Chat (8) */}
      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">
        
        {/* Left: Patient History Timeline (4/12) */}
        <div className="col-span-4 overflow-y-auto pr-4 custom-scrollbar">
          <PatientHistory patientId={patientId} />
        </div>

        {/* Right: AI Insights Hub (8/12) */}
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-6 px-1">
             <Sparkles className="w-5 h-5 text-indigo-500" />
             <div>
                <h3 className="text-sm font-bold text-slate-900">Clinical AI Assistant</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Querying Global Patient Records</p>
             </div>
          </div>
          {/* Chatbot container with fixed height behavior inside grid */}
          <div className="flex-1">
            <RAGChatbot patientId={patientId || 'P12345'} />
          </div>
        </div>

      </div>

    </div>
  );
}
