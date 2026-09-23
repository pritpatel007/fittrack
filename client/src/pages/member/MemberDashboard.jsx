import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipAPI, bookingAPI, attendanceAPI, workoutAPI, progressAPI } from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import ProgressChart from '../../components/dashboard/ProgressChart';
import {
  CreditCard, CalendarCheck, ClipboardList, Dumbbell,
  TrendingUp, AlertTriangle, ChevronRight, Activity
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState({ stats: {} });
  const [workout, setWorkout] = useState(null);
  const [progress, setProgress] = useState({ logs: [], stats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      membershipAPI.getMine().then(r => setMembership(r.data.membership)),
      bookingAPI.getMine().then(r => setBookings(r.data.bookings)),
      attendanceAPI.getMine().then(r => setAttendance(r.data)),
      workoutAPI.getMine().then(r => setWorkout(r.data.plan)),
      progressAPI.getMine().then(r => setProgress(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const daysLeft = membership
    ? Math.max(0, Math.ceil((new Date(membership.endDate) - new Date()) / 86400000))
    : 0;

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.classId?.date) >= new Date());
  const latestProgress = progress.logs.slice(-1)[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1 text-sm">Here's your fitness overview for today.</p>
        </div>
        <Link to="/member/progress" className="btn-primary text-sm hidden sm:flex">
          <TrendingUp size={15} /> Log Progress
        </Link>
      </div>

      {/* Membership expiry alert */}
      {membership && daysLeft <= 7 && daysLeft > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>Your <strong>{membership.planId?.name}</strong> membership expires in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>. Consider renewing to keep your progress going.</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Membership"
          value={membership ? membership.planId?.name : 'None'}
          icon={CreditCard}
          color="brand"
          sub={membership ? `${daysLeft} days left` : 'No active plan'}
        />
        <StatCard
          title="Upcoming Classes"
          value={upcomingBookings.length}
          icon={CalendarCheck}
          color="sky"
          sub="confirmed bookings"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendance.stats?.percentage ?? 0}%`}
          icon={ClipboardList}
          color="green"
          sub={`${attendance.stats?.present ?? 0} of ${attendance.stats?.total ?? 0} sessions`}
        />
        <StatCard
          title="Current Weight"
          value={latestProgress ? `${latestProgress.weight} kg` : '—'}
          icon={Activity}
          color="purple"
          sub={latestProgress ? `BMI: ${latestProgress.bmi}` : 'Log your first entry'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Weight & BMI Progress</h2>
            <Link to="/member/progress" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <ProgressChart data={progress.logs} />
        </div>

        {/* Workout snapshot */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Workout Plan</h2>
            <Link to="/member/workout" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              Full plan <ChevronRight size={14} />
            </Link>
          </div>
          {workout ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <p className="text-brand-300 text-xs font-medium mb-1">Goal</p>
                <p className="text-white text-sm font-medium">{workout.goal}</p>
              </div>
              <p className="text-gray-500 text-xs">Trainer: <span className="text-gray-300">{workout.trainerId?.name}</span></p>
              <div className="space-y-1.5">
                {[...new Set(workout.schedule?.map(e => e.day))].slice(0, 4).map(day => (
                  <div key={day} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                    <span className="text-gray-400">{day}:</span>
                    <span className="text-gray-200 truncate">
                      {workout.schedule.filter(e => e.day === day).map(e => e.exerciseName).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Dumbbell size={28} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No workout plan assigned yet.</p>
              <p className="text-gray-600 text-xs mt-1">Your trainer will set one up for you.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Upcoming Classes</h2>
          <Link to="/member/bookings" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
            Manage <ChevronRight size={14} />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CalendarCheck size={28} className="text-gray-600 mb-2" />
            <p className="text-gray-500 text-sm">No upcoming classes booked.</p>
            <Link to="/classes" className="btn-primary text-xs mt-3 py-2">Browse Classes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingBookings.slice(0, 3).map(b => (
              <div key={b._id} className="p-3.5 rounded-xl bg-dark-850 border border-white/5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-white text-sm">{b.classId?.name}</p>
                  <span className="badge badge-green flex-shrink-0">confirmed</span>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(b.classId?.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {b.classId?.time}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{b.classId?.duration} min · {b.classId?.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
