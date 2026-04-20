import { useRouter } from 'next/router';

export default function PatientHistoryPage() {
  const router = useRouter();
  const { patientId } = router.query;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">History for {patientId}</h1>
    </div>
  );
}
