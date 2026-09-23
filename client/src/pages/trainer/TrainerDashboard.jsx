import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classAPI, workoutAPI, userAPI } from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import { Users, CalendarDays, Dumbbell, ChevronRight, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      classAPI.getMine().then(r => setClasses(r.data.classes)),
      userAPI.getMembers().then(r => setMembers(r.data.members)),
      workoutAPI.getAssigned().then(r => setPlans(r.data.plans)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const upcomingClasses = classes.filter(c => new Date(c.date) >= new Date()).slice(0, 5);
  const assignedMemberIds = new Set(plans.map(p => p.memberId?._id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Welcome, {user?.name?.split(' ')[0]} 💪</h1>
        <p className="text-gray-400 mt-1 text-sm">Trainer dashboard — manage your classes and members.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Members" value={members.length} icon={Users} color="brand" sub="in the gym" />
        <StatCard title="My Classes" value={classes.length} icon={CalendarDays} color="sky" sub="scheduled" />
        <StatCard title="Workout Plans" value={plans.length} icon={Dumbbell} color="green" sub="assigned" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming classes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Upcoming Classes</h2>
            <Link to="/trainer/classes" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              Manage <ChevronRight size={14} />
            </Link>
          </div>
          {upcomingClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No upcoming classes scheduled.</div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map(c => (
                <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/5">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={18} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <Clock size={11} />
                      {new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {c.time}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">{c.enrolledMembers?.length}/{c.capacity}</p>
                    <p className="text-xs text-gray-500">enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members with plans */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Assigned Members</h2>
            <Link to="/trainer/members" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No workout plans assigned yet.</div>
          ) : (
            <div className="space-y-3">
              {plans.slice(0, 5).map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400 text-sm flex-shrink-0">
                    {p.memberId?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{p.memberId?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{p.goal}</p>
                  </div>
                  <span className={`badge ${p.isActive ? 'badge-green' : 'badge-gray'} flex-shrink-0`}>
                    {p.isActive ? 'active' : 'inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
