import { useEffect, useState } from 'react';
import { classAPI, trainerAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Yoga', 'HIIT', 'Cardio', 'Zumba', 'Strength Training', 'Pilates', 'Boxing'];

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = () => {
    Promise.all([
      classAPI.getAll().then(r => setClasses(r.data.classes)),
      trainerAPI.getAll().then(r => setTrainers(r.data.trainers)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditClass(null); reset({}); setModalOpen(true); };
  const openEdit = (c) => {
    setEditClass(c);
    reset({ ...c, date: new Date(c.date).toISOString().split('T')[0], trainerId: c.trainerId?._id });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, capacity: Number(data.capacity), duration: Number(data.duration) };
      if (editClass) await classAPI.update(editClass._id, payload);
      else await classAPI.create(payload);
      toast.success(editClass ? 'Class updated!' : 'Class created!');
      setModalOpen(false);
      fetchData();
    } catch { toast.error('Failed to save class'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try { await classAPI.delete(id); toast.success('Class deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Manage Classes</h1>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus size={16} /> New Class</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-850 border-b border-white/8">
              <tr>
                {['Class', 'Category', 'Trainer', 'Date & Time', 'Enrolled', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {classes.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-500 py-10">No classes found.</td></tr>
              ) : classes.map(c => (
                <tr key={c._id} className="hover:bg-white/2">
                  <td className="table-cell font-medium text-white">{c.name}</td>
                  <td className="table-cell"><span className="badge badge-purple">{c.category}</span></td>
                  <td className="table-cell">{c.trainerId?.name ?? '—'}</td>
                  <td className="table-cell text-xs">
                    <p>{new Date(c.date).toLocaleDateString()}</p>
                    <p className="text-gray-500">{c.time}</p>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 w-16 h-1.5 bg-dark-850 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${Math.round((c.enrolledMembers?.length / c.capacity) * 100)}%` }} />
                      </div>
                      <span className="text-xs">{c.enrolledMembers?.length}/{c.capacity}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${new Date(c.date) >= new Date() ? 'badge-green' : 'badge-gray'}`}>
                      {new Date(c.date) >= new Date() ? 'upcoming' : 'past'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-400 p-1"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editClass ? 'Edit Class' : 'Create Class'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Class Name *</label>
              <input className="input" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input" {...register('category', { required: true })}>
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Trainer *</label>
              <select className="input" {...register('trainerId', { required: true })}>
                <option value="">Select trainer</option>
                {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
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
              <input type="number" className="input" {...register('duration', { required: true })} />
            </div>
            <div>
              <label className="label">Capacity *</label>
              <input type="number" className="input" {...register('capacity', { required: true })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Studio A" {...register('location')} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={3} {...register('description')} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving…' : editClass ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
