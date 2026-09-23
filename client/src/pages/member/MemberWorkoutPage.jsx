import { useEffect, useState } from 'react';
import { workoutAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Dumbbell, User, Target, StickyNote } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MemberWorkoutPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    workoutAPI.getMine()
      .then(r => {
        setPlan(r.data.plan);
        if (r.data.plan?.schedule?.length) {
          setActiveDay(r.data.plan.schedule[0].day);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Dumbbell size={28} className="text-brand-400" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">No Workout Plan Yet</h2>
        <p className="text-gray-400 text-sm max-w-sm">Your trainer will create a personalized workout plan for you. Check back soon!</p>
      </div>
    );
  }

  const activeDayExercises = plan.schedule?.filter(e => e.day === activeDay) ?? [];
  const scheduledDays = [...new Set(plan.schedule?.map(e => e.day))];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">My Workout Plan</h1>

      {/* Plan overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Goal</p>
            <p className="text-white font-medium text-sm mt-0.5">{plan.goal}</p>
          </div>
        </div>
        <div className="card p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Trainer</p>
            <p className="text-white font-medium text-sm mt-0.5">{plan.trainerId?.name}</p>
          </div>
        </div>
        {plan.notes && (
          <div className="card p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <StickyNote size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Notes</p>
              <p className="text-gray-300 text-sm mt-0.5 line-clamp-2">{plan.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.filter(d => scheduledDays.includes(d)).map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeDay === day
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-dark-800 text-gray-400 hover:text-white border border-white/8'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Exercises */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/8 flex items-center justify-between">
          <h2 className="font-semibold text-white">{activeDay}</h2>
          <span className="text-gray-400 text-sm">{activeDayExercises.length} exercise{activeDayExercises.length !== 1 ? 's' : ''}</span>
        </div>
        {activeDayExercises.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Rest day 🧘</div>
        ) : (
          <div className="divide-y divide-white/5">
            {activeDayExercises.map((ex, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 font-bold text-brand-400 text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{ex.exerciseName}</p>
                  {ex.notes && <p className="text-gray-500 text-xs mt-0.5">{ex.notes}</p>}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 flex-shrink-0">
                  {ex.sets && <span><span className="text-white font-semibold">{ex.sets}</span> sets</span>}
                  {ex.reps && <span><span className="text-white font-semibold">{ex.reps}</span> reps</span>}
                  {ex.duration && <span><span className="text-white font-semibold">{ex.duration}</span> min</span>}
                  {ex.restTime && <span className="text-gray-600">{ex.restTime}s rest</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full schedule overview */}
      <div className="card p-5">
        <h2 className="font-semibold text-white mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map(day => {
            const count = plan.schedule?.filter(e => e.day === day).length ?? 0;
            const isActive = scheduledDays.includes(day);
            return (
              <button key={day} onClick={() => isActive && setActiveDay(day)}
                className={`p-2 rounded-lg text-center transition-all ${
                  !isActive ? 'bg-dark-850 opacity-40 cursor-default' :
                  activeDay === day ? 'bg-brand-600/20 border border-brand-500/40' : 'bg-dark-850 hover:bg-dark-800 cursor-pointer'
                }`}
              >
                <p className="text-xs text-gray-400 font-medium">{day.slice(0, 3)}</p>
                <p className={`text-lg font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-600'}`}>{count}</p>
                <p className="text-xs text-gray-500">{isActive ? 'ex' : '—'}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
