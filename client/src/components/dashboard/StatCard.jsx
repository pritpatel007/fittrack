export default function StatCard({ title, value, icon: Icon, color = 'brand', trend, sub }) {
  const colorMap = {
    brand:   { bg: 'bg-brand-500/10',   text: 'text-brand-400',   border: 'border-brand-500/20' },
    green:   { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
    red:     { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
    sky:     { bg: 'bg-sky-500/10',     text: 'text-sky-400',     border: 'border-sky-500/20' },
    purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`card p-5 border ${c.border} hover:scale-[1.01] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-white mt-1">{value ?? '—'}</p>
          {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} className={c.text} />
          </div>
        )}
      </div>
    </div>
  );
}
