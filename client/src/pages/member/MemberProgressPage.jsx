import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { progressAPI } from '../../services/api';
import ProgressChart from '../../components/dashboard/ProgressChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MemberProgressPage() {
  const [data, setData] = useState({ logs: [], stats: null });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const weight = watch('weight');
  const height = watch('height');
  const previewBmi = weight && height
    ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
    : null;

  const fetchProgress = () => {
    progressAPI.getMine()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProgress(); }, []);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await progressAPI.add(formData);
      toast.success('Progress logged!');
      setModalOpen(false);
      reset();
      fetchProgress();
    } catch {
      toast.error('Failed to log progress');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this log?')) return;
    try {
      await progressAPI.delete(id);
      toast.success('Log deleted');
      setData(prev => ({ ...prev, logs: prev.logs.filter(l => l._id !== id) }));
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const { logs, stats } = data;
  const latest = logs[logs.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Progress Tracker</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
          <Plus size={16} /> Log Entry
        </button>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Current Weight', value: `${latest?.weight} kg`, icon: TrendingUp, color: 'brand' },
            { label: 'Current BMI', value: latest?.bmi, icon: TrendingUp, color: 'sky' },
            {
              label: 'Weight Change',
              value: `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange} kg`,
              icon: stats.weightChange <= 0 ? TrendingDown : TrendingUp,
              color: stats.weightChange <= 0 ? 'green' : 'amber',
            },
            { label: 'Total Logs', value: stats.totalLogs, icon: Minus, color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`card p-4 border border-${color === 'brand' ? 'brand' : color}-500/20`}>
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-display text-2xl font-bold text-white mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-white mb-4">Weight & BMI Over Time</h2>
        <ProgressChart data={logs} />
      </div>

      {/* Log table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="font-semibold text-white">All Entries</h2>
        </div>
        {logs.length === 0 ? (
          <div className="p-10 text-center">
            <TrendingUp size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No entries yet. Log your first progress!</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm mt-4">
              <Plus size={14} /> Log Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-850 border-b border-white/8">
                <tr>
                  {['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'Body Fat', 'Notes', ''].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...logs].reverse().map(log => (
                  <tr key={log._id} className="hover:bg-white/2">
                    <td className="table-cell">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="table-cell font-semibold text-white">{log.weight}</td>
                    <td className="table-cell">{log.height}</td>
                    <td className="table-cell">
                      <span className={`font-semibold ${log.bmi < 18.5 ? 'text-sky-400' : log.bmi < 25 ? 'text-emerald-400' : log.bmi < 30 ? 'text-amber-400' : 'text-red-400'}`}>
                        {log.bmi}
                      </span>
                    </td>
                    <td className="table-cell">{log.bodyFat ? `${log.bodyFat}%` : '—'}</td>
                    <td className="table-cell max-w-xs truncate">{log.notes || '—'}</td>
                    <td className="table-cell">
                      <button onClick={() => handleDelete(log._id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); reset(); }} title="Log Progress Entry">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Weight (kg) *</label>
              <input type="number" step="0.1" className={`input ${errors.weight ? 'border-red-500' : ''}`}
                placeholder="75.0" {...register('weight', { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Height (cm) *</label>
              <input type="number" step="0.1" className={`input ${errors.height ? 'border-red-500' : ''}`}
                placeholder="175" {...register('height', { required: true, valueAsNumber: true })} />
            </div>
          </div>
          {previewBmi && (
            <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-sm text-center">
              Calculated BMI: <span className="text-brand-300 font-bold">{previewBmi}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Body Fat (%)</label>
              <input type="number" step="0.1" className="input" placeholder="18.5" {...register('bodyFat', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Waist (cm)</label>
              <input type="number" step="0.1" className="input" placeholder="80" {...register('waist', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Chest (cm)</label>
              <input type="number" step="0.1" className="input" placeholder="95" {...register('chest', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} {...register('date')} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={3} placeholder="How are you feeling? Any observations…" {...register('notes')} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
