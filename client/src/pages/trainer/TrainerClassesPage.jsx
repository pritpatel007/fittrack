import { useEffect, useState } from 'react';
import { classAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { Plus, CalendarDays, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Yoga', 'HIIT', 'Cardio', 'Zumba', 'Strength Training', 'Pilates', 'Boxing'];

export default function TrainerClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchClasses = () => {
    classAPI.getMine()
      .then(r => setClasses(r.data.classes))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClasses(); }, []);

  const openCreate = () => { setEditClass(null); reset({}); setModalOpen(true); };
  const openEdit = (c) => {
    setEditClass(c);
    reset({ ...c, date: new Date(c.date).toISOString().split('T')[0], trainerId: c.trainerId?._id || c.trainerId });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, trainerId: user.id, capacity: Number(data.capacity), duration: Number(data.duration) };
      if (editClass) await classAPI.update(editClass._id, payload);
      else await classAPI.create(payload);
      toast.success(editClass ? 'Class updated!' : 'Class created!');
      setModalOpen(false);
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save class');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">My Classes</h1>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarDays size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No classes yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(c => (
            <div key={c._id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <span className="badge badge-purple">{c.category}</span>
                <span className={`badge ${new Date(c.date) >= new Date() ? 'badge-green' : 'badge-gray'}`}>
                  {new Date(c.date) >= new Date() ? 'upcoming' : 'past'}
                </span>
              </div>
              <h3 className="font-semibold text-white">{c.name}</h3>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-2"><CalendarDays size={12} className="text-brand-400" />
                  {new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {c.time}
                </div>
                <div className="flex items-center gap-2"><Clock size={12} className="text-brand-400" />{c.duration} minutes</div>
                <div className="flex items-center gap-2"><Users size={12} className="text-brand-400" />{c.enrolledMembers?.length}/{c.capacity} enrolled</div>
              </div>
              <div className="w-full bg-dark-850 rounded-full h-1.5">
                <div className="bg-brand-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.round((c.enrolledMembers?.length / c.capacity) * 100)}%` }} />
              </div>
              <button onClick={() => openEdit(c)} className="btn-secondary text-xs w-full py-2">Edit Class</button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editClass ? 'Edit Class' : 'Create Class'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Class Name *</label>
              <input className={`input ${errors.name ? 'border-red-500' : ''}`} placeholder="Morning Yoga"
                {...register('name', { required: true })} />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input" {...register('category', { required: true })}>
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Studio A" {...register('location')} />
            </div>
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input" {...register('date', { required: true })} />
            </div>
            <div>
              <label className="label">Time *</label>
              <input className="input" placeholder="09:00 AM" {...register('time', { required: true })} />
            </div>
            <div>
              <label className="label">Duration (min) *</label>
              <input type="number" className="input" placeholder="60" {...register('duration', { required: true })} />
            </div>
            <div>
              <label className="label">Capacity *</label>
              <input type="number" className="input" placeholder="20" {...register('capacity', { required: true })} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={3} {...register('description')} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving…' : editClass ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
