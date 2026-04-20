import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

function TagInput({ label, tags, inputValue, onInputChange, onAddTag, onRemoveTag }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      <div className="min-h-[48px] w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={`${label}-${tag}`}
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-indigo-600 hover:text-indigo-800"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => onAddTag(e)}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
        />
      </div>
      <p className="text-xs text-gray-500">Press Enter to add.</p>
    </div>
  );
}

export default function Home() {
  const [patientId, setPatientId] = useState('');
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    blood_group: '',
    contact: '',
    address: '',
    emergency_contact: '',
    known_allergies: [],
    chronic_conditions: [],
    current_medications: [],
    insurance_id: '',
  });
  const [tagDrafts, setTagDrafts] = useState({
    known_allergies: '',
    chronic_conditions: '',
    current_medications: '',
  });
  const router = useRouter();

  const requiredFieldErrors = useMemo(() => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full Name is required';
    if (!String(form.age).trim()) errors.age = 'Age is required';
    if (String(form.age).trim() && (!Number.isInteger(Number(form.age)) || Number(form.age) <= 0)) {
      errors.age = 'Enter a valid age';
    }
    if (!form.contact.trim()) errors.contact = 'Contact Number is required';
    return errors;
  }, [form.age, form.contact, form.name]);

  const isFormValid = Object.keys(requiredFieldErrors).length === 0;

  const handleFindPatient = async () => {
    if (!patientId.trim()) {
      setLookupError('Patient ID is required');
      setFoundPatient(null);
      return;
    }

    setIsLookupLoading(true);
    setLookupError('');
    setFoundPatient(null);
    try {
      const response = await fetch(`/api/patients?patientId=${encodeURIComponent(patientId.trim())}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Patient lookup failed');
      }
      const data = await response.json();
      if (data.patient) {
        setFoundPatient(data.patient);
      } else {
        setLookupError('Patient not found');
      }
    } catch (error) {
      setLookupError(error.message);
    } finally {
      setIsLookupLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addTag = (field) => (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = tagDrafts[field].trim();
    if (!value) return;
    updateField(
      field,
      Array.from(new Set([...(form[field] || []), value]))
    );
    setTagDrafts((prev) => ({ ...prev, [field]: '' }));
  };

  const removeTag = (field, tag) => {
    updateField(field, (form[field] || []).filter((item) => item !== tag));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const errors = { ...requiredFieldErrors };
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSavingPatient(true);
    setFormErrors({});
    const newPatientId = `P${Math.floor(10000 + Math.random() * 90000)}`;
    const payload = {
      patient_id: newPatientId,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender || null,
      blood_group: form.blood_group || null,
      contact: form.contact.trim(),
      address: form.address.trim() || null,
      emergency_contact: form.emergency_contact.trim() || null,
      known_allergies: form.known_allergies,
      chronic_conditions: form.chronic_conditions,
      current_medications: form.current_medications,
      insurance_id: form.insurance_id.trim() || null,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: payload }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create patient');
      }
      const result = await response.json();
      router.push(`/consult?patientId=${result.patientId}`);
    } catch (error) {
      setFormErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsSavingPatient(false);
    }
  };

  const handleDeveloperQuickEntry = async () => {
    const devPatientId = 'PDEV12345';
    setIsDevLoading(true);
    setLookupError('');

    try {
      const existingResponse = await fetch(`/api/patients?patientId=${encodeURIComponent(devPatientId)}`);
      if (!existingResponse.ok) {
        const data = await existingResponse.json().catch(() => ({}));
        throw new Error(data.message || 'Developer patient lookup failed');
      }

      const existingData = await existingResponse.json();
      if (!existingData.patient) {
        const devPatientPayload = {
          patient_id: devPatientId,
          name: 'Dev Test Patient',
          age: 34,
          gender: 'Male',
          blood_group: 'O+',
          contact: '9999999999',
          address: 'Developer Mode Address',
          emergency_contact: '8888888888',
          known_allergies: ['Penicillin'],
          chronic_conditions: ['Hypertension'],
          current_medications: ['Amlodipine 5mg'],
          insurance_id: 'DEV-INS-001',
          created_at: new Date().toISOString(),
        };

        const createResponse = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientData: devPatientPayload }),
        });
        if (!createResponse.ok) {
          const data = await createResponse.json().catch(() => ({}));
          throw new Error(data.message || 'Developer patient creation failed');
        }
      }

      router.push(`/consult?patientId=${devPatientId}`);
    } catch (error) {
      setLookupError(error.message);
    } finally {
      setIsDevLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>ClinicAI | Patient Lookup</title>
      </Head>

      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-6 md:p-8 border border-indigo-50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">ClinicAI</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium italic">Empowering doctor-patient conversations</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Patient Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleFindPatient}
            disabled={isLookupLoading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-70"
          >
            {isLookupLoading ? 'Finding Patient...' : 'Find Patient'}
          </button>

          <button
            type="button"
            onClick={handleDeveloperQuickEntry}
            disabled={isDevLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold transition-all hover:bg-black disabled:opacity-70"
          >
            {isDevLoading ? 'Preparing Developer Patient...' : 'Developer Quick Entry'}
          </button>

          {lookupError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-700 font-semibold">{lookupError}</p>
              {lookupError === 'Patient not found' && (
                <button
                  type="button"
                  onClick={() => setShowRegistration(true)}
                  className="mt-3 bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50"
                >
                  New Patient
                </button>
              )}
            </div>
          )}

          {foundPatient && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-indigo-700">Patient Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3 border border-indigo-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Name</p>
                  <p className="text-gray-900 font-bold">{foundPatient.name || 'Unknown'}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-indigo-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Age</p>
                  <p className="text-gray-900 font-bold">{foundPatient.age ?? 'Unknown'}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-indigo-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Allergies</p>
                  <p className="text-gray-900 font-bold">
                    {(foundPatient.known_allergies || []).length
                      ? foundPatient.known_allergies.join(', ')
                      : 'None'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/consult?patientId=${foundPatient.patient_id}`)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all"
              >
                Start Consultation
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full text-center py-3 rounded-2xl font-bold transition-all border-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            >
              Register New Patient
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-widest">
        Voice-Driven Clinic 9-Hour Sprint Edition
      </p>

      {showRegistration && (
        <div className="fixed inset-0 bg-black/30 z-20 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="w-full md:max-w-3xl max-h-[95vh] overflow-y-auto bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-indigo-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-gray-900">New Patient Registration</h2>
              <button
                type="button"
                onClick={() => setShowRegistration(false)}
                className="text-gray-500 hover:text-gray-700 font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {formErrors.name && <p className="mt-1 text-xs font-semibold text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.age ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {formErrors.age && <p className="mt-1 text-xs font-semibold text-red-600">{formErrors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.contact ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {formErrors.contact && <p className="mt-1 text-xs font-semibold text-red-600">{formErrors.contact}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                <select
                  value={form.blood_group}
                  onChange={(e) => updateField('blood_group', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUP_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={form.emergency_contact}
                  onChange={(e) => updateField('emergency_contact', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Known Allergies"
                  tags={form.known_allergies}
                  inputValue={tagDrafts.known_allergies}
                  onInputChange={(value) => setTagDrafts((prev) => ({ ...prev, known_allergies: value }))}
                  onAddTag={addTag('known_allergies')}
                  onRemoveTag={(tag) => removeTag('known_allergies', tag)}
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Chronic Conditions"
                  tags={form.chronic_conditions}
                  inputValue={tagDrafts.chronic_conditions}
                  onInputChange={(value) => setTagDrafts((prev) => ({ ...prev, chronic_conditions: value }))}
                  onAddTag={addTag('chronic_conditions')}
                  onRemoveTag={(tag) => removeTag('chronic_conditions', tag)}
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Current Medications"
                  tags={form.current_medications}
                  inputValue={tagDrafts.current_medications}
                  onInputChange={(value) => setTagDrafts((prev) => ({ ...prev, current_medications: value }))}
                  onAddTag={addTag('current_medications')}
                  onRemoveTag={(tag) => removeTag('current_medications', tag)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Insurance ID</label>
                <input
                  type="text"
                  value={form.insurance_id}
                  onChange={(e) => updateField('insurance_id', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {formErrors.submit && (
                <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-700">{formErrors.submit}</p>
                </div>
              )}

              <div className="md:col-span-2 flex flex-col-reverse md:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="w-full md:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSavingPatient}
                  className="w-full md:flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isSavingPatient ? 'Saving Patient...' : 'Create Patient & Start Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
