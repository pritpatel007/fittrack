import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-sm border border-white/10">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function ProgressChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
        No progress data yet
      </div>
    );
  }

  const chartData = data.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Weight: log.weight,
    BMI: log.bmi,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        <Line type="monotone" dataKey="Weight" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="BMI" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
