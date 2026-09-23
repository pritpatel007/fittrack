import { useEffect, useState } from 'react';
import { attendanceAPI, userAPI, classAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAttendancePage() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = () => {
    Promise.all([
      attendanceAPI.getAll().then(r => setRecords(r.data.records)),
      userAPI.getMembers().then(r => setMembers(r.data.members)),
      classAPI.getAll().then(r => setClasses(r.data.classes)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await attendanceAPI.mark({ ...data, classId: data.classId || undefined });
      toast.success('Attendance marked!');
      setModalOpen(false);
      reset();
      fetchData();
    } catch { toast.error('Failed to mark attendance'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Attendance</h1>
        <button onClick={() => { reset({ date: new Date().toISOString().split('T')[0] }); setModalOpen(true); }}
          className="btn-primary text-sm">
          <Plus size={16} /> Mark Attendance
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-850 border-b border-white/8">
              <tr>
                {['Member', 'Date', 'Class', 'Status', 'Marked By'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-10">No attendance records.</td></tr>
              ) : records.map(r => (
                <tr key={r._id} className="hover:bg-white/2">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                        {r.userId?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{r.userId?.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td className="table-cell text-gray-400">{r.classId?.name ?? 'General'}</td>
                  <td className="table-cell">
                    <span className={`badge ${r.status === 'present' ? 'badge-green' : r.status === 'late' ? 'badge-yellow' : 'badge-red'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">{r.markedBy?.name ?? 'System'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Mark Attendance" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Member *</label>
            <select className="input" {...register('userId', { required: true })}>
              <option value="">Select member</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Class (optional)</label>
            <select className="input" {...register('classId')}>
              <option value="">General / No class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name} — {new Date(c.date).toLocaleDateString()}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status *</label>
            <select className="input" {...register('status', { required: true })}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" {...register('date')} />
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input" placeholder="Optional notes…" {...register('notes')} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving…' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
