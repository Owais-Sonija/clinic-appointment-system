import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { BsClockHistory, BsFileEarmarkMedicalFill, BsClipboardPulse, BsArrowLeft, BsFileTextFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const NursePatientHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // patientId
  const navigate = useNavigate();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/api/nurse/patients/${id}/history`);
        setHistory(res.data.data);
      } catch (err: any) {
        toast.error('Failed to fetch patient history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  if (loading) return <div className="p-6"><Skeleton count={10} height={40} className="mb-4" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 transition mb-4">
        <BsArrowLeft className="mr-2" /> Back to Queue
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient History (Clinical)</h1>
        <p className="text-gray-500 font-medium">Read-only oversight for clinical preparation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <BsClipboardPulse className="mr-2 text-blue-600" /> Historical Vitals
          </h2>
          <div className="space-y-4">
            {history?.vitals.length > 0 ? (
              history.vitals.map((v: any) => (
                <div key={v._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                    <span className="text-sm font-bold text-gray-400 font-mono">{new Date(v.recordedAt).toLocaleDateString()}</span>
                    <span className="text-xs font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">BMI: {v.bmi}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">BP</p>
                      <p className="text-sm font-bold text-gray-800">{v.bp}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Pulse</p>
                      <p className="text-sm font-bold text-gray-800">{v.pulse}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">SpO2</p>
                      <p className="text-sm font-bold text-gray-800">{v.spo2}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : <p className="text-gray-400 italic">No vitals on record.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <BsClockHistory className="mr-2 text-purple-600" /> Appointment Timeline
          </h2>
          <div className="space-y-4">
            {history?.appointments.length > 0 ? (
              history.appointments.map((apt: any) => (
                <div key={apt._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Status: {apt.status}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {apt.status}
                  </span>
                </div>
              ))
            ) : <p className="text-gray-400 italic">No past appointments.</p>}
          </div>

          <h2 className="text-xl font-bold text-gray-800 flex items-center pt-4">
            <BsFileEarmarkMedicalFill className="mr-2 text-rose-600" /> Medical Summary
          </h2>
          <div className="space-y-4">
            {history?.medicalRecords.length > 0 ? (
              history.medicalRecords.map((rec: any) => (
                <div key={rec._id} className="bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <BsFileTextFill className="text-rose-500" />
                    <span className="text-sm font-bold text-gray-700">Diagnosis: {rec.diagnosis}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed italic">Treatment: {rec.treatmentPlan}</p>
                </div>
              ))
            ) : <p className="text-gray-400 italic">No medical records accessible.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursePatientHistory;
