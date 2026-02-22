import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { BsClipboardPulse, BsSaveFill, BsArrowLeft, BsCalculatorFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const RecordVitals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vitals, setVitals] = useState({
    appointmentId: id,
    bp: '',
    pulse: '',
    temperature: '',
    respiratoryRate: '',
    spo2: '',
    weight: '',
    height: '',
    bmi: 0
  });

  useEffect(() => {
    // Fetch existing vitals if any
    const fetchVitals = async () => {
      try {
        const res = await axiosInstance.get(`/api/nurse/vitals/${id}`);
        if (res.data.data) {
          const v = res.data.data;
          setVitals({
            ...vitals,
            bp: v.bp,
            pulse: v.pulse,
            temperature: v.temperature,
            respiratoryRate: v.respiratoryRate,
            spo2: v.spo2,
            weight: v.weight,
            height: v.height,
            bmi: v.bmi
          });
        }
      } catch (err: any) {
        console.log('No previous vitals found');
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [id]);

  useEffect(() => {
    // Auto-calculate BMI
    if (vitals.weight && vitals.height) {
      const weightKg = parseFloat(vitals.weight as string);
      const heightM = parseFloat(vitals.height as string) / 100; // cm to m
      if (heightM > 0) {
        const bmi = weightKg / (heightM * heightM);
        setVitals(prev => ({ ...prev, bmi: parseFloat(bmi.toFixed(2)) }));
      }
    }
  }, [vitals.weight, vitals.height]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosInstance.post('/api/nurse/vitals', vitals);
      toast.success('Vitals recorded successfully');
      navigate('/nurse/appointments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save vitals');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton count={8} height={50} className="mb-4" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 transition mb-4">
        <BsArrowLeft className="mr-2" /> Back to Queue
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <BsClipboardPulse size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Record Vitals</h1>
              <p className="text-sm text-gray-500">Enter clinical measurements for the patient.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-gray-400">Appointment ID</p>
            <p className="font-mono text-sm text-gray-600">{id?.substr(-8).toUpperCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Blood Pressure (mmHg)" value={vitals.bp} onChange={(e) => setVitals({ ...vitals, bp: e.target.value })} placeholder="e.g. 120/80" />
            <InputGroup label="Pulse (BPM)" value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} type="number" placeholder="72" />
            <InputGroup label="Temperature (°C)" value={vitals.temperature} onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })} type="number" placeholder="36.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Respiratory Rate" value={vitals.respiratoryRate} onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })} type="number" placeholder="16" />
            <InputGroup label="SpO2 (%)" value={vitals.spo2} onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })} type="number" placeholder="98" />
          </div>

          <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroup label="Weight (kg)" value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} type="number" placeholder="70" />
            <InputGroup label="Height (cm)" value={vitals.height} onChange={(e) => setVitals({ ...vitals, height: e.target.value })} type="number" placeholder="175" />
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-center items-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Calculated BMI</p>
              <div className="flex items-center space-x-2">
                <BsCalculatorFill className="text-blue-500" />
                <span className="text-2xl font-black text-gray-800">{vitals.bmi || '--'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-md flex items-center space-x-2"
            >
              <BsSaveFill />
              <span>{saving ? 'Saving...' : 'Commit Vitals'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
      required
    />
  </div>
);

export default RecordVitals;
