import { useEffect, useState } from 'react';
import { workoutAPI, userAPI } from '../../services/api';
import { useForm, useFieldArray } from 'react-hook-form';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Plus, Trash2, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TrainerWorkoutManagerPage() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { schedule: [{ day: 'Monday', exerciseName: '', sets: '', reps: '', duration: '', restTime: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'schedule' });

  const fetchData = () => {
    Promise.all([
      workoutAPI.getAssigned().then(r => setPlans(r.data.plans)),
      userAPI.getMembers().then(r => setMembers(r.data.members)),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditPlan(null);
    reset({ schedule: [{ day: 'Monday', exerciseName: '', sets: '', reps: '', duration: '', restTime: '' }] });
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    reset({ memberId: plan.memberId?._id, goal: plan.goal, notes: plan.notes, schedule: plan.schedule });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        schedule: data.schedule.map(ex => ({
          ...ex,
          sets: ex.sets ? Number(ex.sets) : undefined,
          reps: ex.reps ? Number(ex.reps) : undefined,
          duration: ex.duration ? Number(ex.duration) : undefined,
          restTime: ex.restTime ? Number(ex.restTime) : undefined,
        })),
      };
      if (editPlan) await workoutAPI.update(editPlan._id, payload);
      else await workoutAPI.create(payload);
      toast.success(editPlan ? 'Plan updated!' : 'Plan created!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Workout Plans</h1>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="card p-12 text-center">
          <Dumbbell size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No workout plans created yet.</p>
          <button onClick={openCreate} className="btn-primary text-sm">Create First Plan</button>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan._id} className="card overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={18} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{plan.memberId?.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{plan.goal}</p>
                    <p className="text-gray-500 text-xs mt-1">{plan.schedule?.length} exercises across {[...new Set(plan.schedule?.map(e => e.day))].length} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`badge ${plan.isActive ? 'badge-green' : 'badge-gray'}`}>{plan.isActive ? 'active' : 'inactive'}</span>
                  <button onClick={() => openEdit(plan)} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
                  <button onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)} className="text-gray-400 hover:text-white p-1">
                    {expandedPlan === plan._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
              {expandedPlan === plan._id && (
                <div className="border-t border-white/8 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-dark-850">
                      <tr>
                        {['Day', 'Exercise', 'Sets', 'Reps', 'Duration', 'Rest'].map(h => (
                          <th key={h} className="table-header">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {plan.schedule?.map((ex, i) => (
                        <tr key={i} className="hover:bg-white/2">
                          <td className="table-cell text-brand-400 font-medium">{ex.day}</td>
                          <td className="table-cell text-white font-medium">{ex.exerciseName}</td>
                          <td className="table-cell">{ex.sets ?? '—'}</td>
                          <td className="table-cell">{ex.reps ?? '—'}</td>
                          <td className="table-cell">{ex.duration ? `${ex.duration}m` : '—'}</td>
                          <td className="table-cell">{ex.restTime ? `${ex.restTime}s` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editPlan ? 'Edit Workout Plan' : 'Create Workout Plan'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Member *</label>
              <select className="input" {...register('memberId', { required: true })}>
                <option value="">Select member</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Goal *</label>
              <input className="input" placeholder="e.g. Lose 10kg in 12 weeks" {...register('goal', { required: true })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input resize-none" rows={2} {...register('notes')} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Exercises</label>
              <button type="button" onClick={() => append({ day: 'Monday', exerciseName: '', sets: '', reps: '', duration: '', restTime: '' })}
                className="text-brand-400 hover:text-brand-300 text-xs flex items-center gap-1 font-medium">
                <Plus size={13} /> Add Exercise
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {fields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-6 gap-2 p-3 rounded-xl bg-dark-850 border border-white/5">
                  <select className="input text-xs col-span-2" {...register(`schedule.${i}.day`)}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input className="input text-xs col-span-3" placeholder="Exercise name" {...register(`schedule.${i}.exerciseName`, { required: true })} />
                  <button type="button" onClick={() => remove(i)} className="text-gray-500 hover:text-red-400 flex items-center justify-center">
                    <Trash2 size={14} />
                  </button>
                  <input type="number" className="input text-xs" placeholder="Sets" {...register(`schedule.${i}.sets`)} />
                  <input type="number" className="input text-xs" placeholder="Reps" {...register(`schedule.${i}.reps`)} />
                  <input type="number" className="input text-xs" placeholder="Min" {...register(`schedule.${i}.duration`)} />
                  <input type="number" className="input text-xs" placeholder="Rest(s)" {...register(`schedule.${i}.restTime`)} />
                  <div />
                </div>
              ))}
            </div>
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
