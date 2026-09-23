import { useEffect, useState } from 'react';
import { planAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Pencil, Trash2, Check, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPlans = () => {
    planAPI.getAll()
      .then(r => setPlans(r.data.plans))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditPlan(null);
    reset({});
    setFeaturesInput('');
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    reset(plan);
    setFeaturesInput(plan.features?.join('\n') || '');
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, price: Number(data.price), durationInDays: Number(data.durationInDays),
        features: featuresInput.split('\n').map(f => f.trim()).filter(Boolean) };
      if (editPlan) await planAPI.update(editPlan._id, payload);
      else await planAPI.create(payload);
      toast.success(editPlan ? 'Plan updated!' : 'Plan created!');
      setModalOpen(false);
      fetchPlans();
    } catch { toast.error('Failed to save plan'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try { await planAPI.delete(id); toast.success('Plan deleted'); fetchPlans(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Membership Plans</h1>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus size={16} /> New Plan</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map(plan => (
          <div key={plan._id} className="card p-5 space-y-4" style={{ borderColor: `${plan.color}30` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">{plan.name}</p>
                <p className="font-display text-3xl font-bold text-white mt-1">${plan.price}</p>
                <p className="text-gray-500 text-xs mt-0.5">{plan.durationInDays} days</p>
              </div>
              <span className={`badge ${plan.isActive ? 'badge-green' : 'badge-gray'}`}>{plan.isActive ? 'active' : 'inactive'}</span>
            </div>
            <ul className="space-y-1.5">
              {plan.features?.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={13} className="text-emerald-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-1">
              <button onClick={() => openEdit(plan)} className="btn-secondary flex-1 text-xs py-2 gap-1.5"><Pencil size={13} /> Edit</button>
              <button onClick={() => handleDelete(plan._id)} className="btn-danger flex-1 text-xs py-2 gap-1.5"><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPlan ? 'Edit Plan' : 'Create Plan'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Plan Name *</label>
              <input className="input" placeholder="Premium" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="label">Price (USD) *</label>
              <input type="number" className="input" placeholder="99" {...register('price', { required: true })} />
            </div>
            <div>
              <label className="label">Duration (days) *</label>
              <input type="number" className="input" placeholder="30" {...register('durationInDays', { required: true })} />
            </div>
            <div>
              <label className="label">Color (hex)</label>
              <input className="input" placeholder="#6366f1" {...register('color')} />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="isActive" className="w-4 h-4 rounded accent-brand-500" {...register('isActive')} />
              <label htmlFor="isActive" className="text-sm text-gray-300">Active (visible to members)</label>
            </div>
          </div>
          <div>
            <label className="label">Features (one per line)</label>
            <textarea className="input resize-none" rows={6} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)}
              placeholder={"Unlimited Gym Access\n10 Group Classes/Month\nPersonal Trainer Consultation"} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving…' : editPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
