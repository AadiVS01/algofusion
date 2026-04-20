import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePatientPDF(structuredData, patientId, patientProfile) {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CLINIC AI | MEDICAL PRESCRIPTION', 14, 22);

  doc.setFontSize(10);
  doc.text(`Patient Name: ${patientProfile?.name || 'N/A'}`, 14, 32);
  doc.text(`Age/Gender: ${patientProfile?.age || 'N/A'}Y / ${patientProfile?.gender || 'N/A'}`, 14, 37);
  doc.text(`Blood Group: ${patientProfile?.blood_group || 'N/A'}`, 14, 42);
  doc.text(`Patient ID: ${patientId || 'P12345'}`, 140, 32);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 37);

  doc.setLineWidth(0.5);
  doc.line(14, 48, 196, 48);

  doc.setFontSize(12);
  doc.text('Clinical Findings', 14, 58);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Chief Complaint:', 14, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(structuredData?.chief_complaint || 'N/A', 50, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Diagnosis:', 14, 74);
  doc.setFont('helvetica', 'normal');
  doc.text(structuredData?.diagnosis || 'N/A', 50, 74, { maxWidth: 140 });

  if (structuredData?.medications && structuredData.medications.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription (Rx)', 14, 105);
    autoTable(doc, {
      startY: 110,
      head: [['Medicine', 'Dosage', 'Frequency', 'Timing', 'Duration']],
      body: structuredData.medications.map((m) => [m.name, m.dosage, m.frequency, m.timing, m.duration]),
      theme: 'striped',
      headStyles: { fillColor: [0, 0, 0] },
    });
  }

  const finalY = doc.lastAutoTable?.finalY || 110;
  doc.setFont('helvetica', 'bold');
  doc.text('Advice & Follow-up:', 14, finalY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(structuredData?.follow_up || 'General care advised.', 14, finalY + 22, { maxWidth: 180 });

  doc.save(`Prescription_${patientId || 'Patient'}_Report.pdf`);
}
