import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { BsPencilSquare, BsSaveFill, BsArrowLeft, BsFileEarmarkTextFill, BsExclamationTriangleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const NursingNotes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState({
    appointmentId: id,
    observations: '',
    allergies: '',
    medicationsAdministered: ''
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get(`/api/nurse/notes/${id}`);
        if (res.data.data && res.data.data.length > 0) {
          const n = res.data.data[0];
          setNotes({
            ...notes,
            observations: n.observations,
            allergies: n.allergies,
            medicationsAdministered: n.medicationsAdministered
          });
        }
      } catch (err: any) {
        console.log('No previous notes found');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.observations) {
      toast.warning('Observations are mandatory');
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post('/api/nurse/notes', notes);
      toast.success('Nursing notes saved successfully');
      navigate('/nurse/appointments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton count={5} height={60} className="mb-4" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 transition mb-4">
        <BsArrowLeft className="mr-2" /> Back to Queue
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center space-x-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <BsPencilSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nursing Observations</h1>
            <p className="text-sm text-gray-500">Record critical notes and allergy alerts for the doctor.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              Observations <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              rows={4}
              value={notes.observations}
              onChange={(e) => setNotes({ ...notes, observations: e.target.value })}
              placeholder="Describe patient's status, appearance, or any immediate concerns..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <BsExclamationTriangleFill className="text-amber-500 mr-2" />
                Allergies (Self-Reported)
              </label>
              <textarea
                rows={3}
                value={notes.allergies}
                onChange={(e) => setNotes({ ...notes, allergies: e.target.value })}
                placeholder="List any drug or food allergies..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <BsFileEarmarkTextFill className="text-blue-500 mr-2" />
                Pre-Consult Meds/Prep
              </label>
              <textarea
                rows={3}
                value={notes.medicationsAdministered}
                onChange={(e) => setNotes({ ...notes, medicationsAdministered: e.target.value })}
                placeholder="Any medication given in clinic or preparation steps taken..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving || !notes.observations}
              className={`px-8 py-3 rounded-xl font-bold shadow-md flex items-center space-x-2 transition ${saving ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
              <BsSaveFill />
              <span>{saving ? 'Saving...' : 'Save Nursing Notes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NursingNotes;
