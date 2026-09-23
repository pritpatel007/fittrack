import { useEffect, useState } from 'react';
import { attendanceAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MemberAttendancePage() {
  const [data, setData] = useState({ records: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceAPI.getMine()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  const { records, stats } = data;
  const absent = (stats.total || 0) - (stats.present || 0);

  const pieData = [
    { name: 'Present', value: stats.present || 0, color: '#10b981' },
    { name: 'Absent/Late', value: absent, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">Attendance History</h1>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sessions', value: stats.total ?? 0, color: 'text-white' },
          { label: 'Present', value: stats.present ?? 0, color: 'text-emerald-400' },
          { label: 'Attendance Rate', value: `${stats.percentage ?? 0}%`, color: stats.percentage >= 75 ? 'text-emerald-400' : 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        {pieData.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-white mb-4">Attendance Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Records table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-white/8">
            <h2 className="font-semibold text-white">Recent Records</h2>
          </div>
          {records.length === 0 ? (
            <div className="p-10 flex flex-col items-center text-center">
              <ClipboardList size={32} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No attendance records yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-850 border-b border-white/8">
                  <tr>
                    {['Date', 'Class', 'Status'].map(h => <th key={h} className="table-header">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map(r => (
                    <tr key={r._id} className="hover:bg-white/2">
                      <td className="table-cell">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                      <td className="table-cell">{r.classId?.name ?? 'General'}</td>
                      <td className="table-cell">
                        <span className={`badge ${r.status === 'present' ? 'badge-green' : r.status === 'late' ? 'badge-yellow' : 'badge-red'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
