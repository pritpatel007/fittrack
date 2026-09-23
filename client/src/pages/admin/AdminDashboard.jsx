import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, UserCheck, CreditCard, CalendarDays, BookOpen, ClipboardList, DollarSign, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const { stats, recentUsers, recentBookings, monthlySignups } = data;

  const chartData = monthlySignups.map(m => ({
    month: MONTH_NAMES[m._id - 1],
    signups: m.count,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Full platform overview and analytics.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"        value={stats.totalUsers}        icon={Users}       color="brand"  />
        <StatCard title="Active Members"     value={stats.totalMembers}      icon={UserCheck}   color="green"  />
        <StatCard title="Trainers"           value={stats.totalTrainers}     icon={UserCheck}   color="sky"    />
        <StatCard title="Active Memberships" value={stats.activeMemberships} icon={CreditCard}  color="purple" />
        <StatCard title="Total Classes"      value={stats.totalClasses}      icon={CalendarDays} color="amber" />
        <StatCard title="Total Bookings"     value={stats.totalBookings}     icon={BookOpen}    color="brand"  />
        <StatCard title="Attendance Rate"    value={`${stats.attendanceRate}%`} icon={ClipboardList} color="green" sub={`${stats.totalAttendance} sessions tracked`} />
        <StatCard title="Total Revenue"      value={`$${stats.revenue}`}     icon={DollarSign}  color="amber"  sub="from memberships" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly signups chart */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-semibold text-white mb-4">New Signups (Last 6 Months)</h2>
          {chartData.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">No signup data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="signups" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent users */}
        <div className="card p-5">
          <h2 className="font-semibold text-white mb-4">Recent Signups</h2>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs flex-shrink-0">
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.name}</p>
                  <p className="text-gray-500 text-xs">{u.email}</p>
                </div>
                <span className={`badge text-xs capitalize ${u.role === 'admin' ? 'badge-red' : u.role === 'trainer' ? 'badge-blue' : 'badge-green'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/8">
          <h2 className="font-semibold text-white">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-850 border-b border-white/8">
              <tr>
                {['Member', 'Class', 'Date', 'Status'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.map(b => (
                <tr key={b._id} className="hover:bg-white/2">
                  <td className="table-cell font-medium text-white">{b.userId?.name}</td>
                  <td className="table-cell">{b.classId?.name}</td>
                  <td className="table-cell">{b.classId?.date ? new Date(b.classId.date).toLocaleDateString() : '—'}</td>
                  <td className="table-cell">
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-red'}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
