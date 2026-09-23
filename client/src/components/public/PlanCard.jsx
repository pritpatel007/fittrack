import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PlanCard({ plan, onSelect, highlight = false }) {
  const { user } = useAuth();

  return (
    <div className={`relative card p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${
      highlight
        ? 'border-brand-500/60 shadow-xl shadow-brand-500/10 bg-gradient-to-b from-brand-600/10 to-dark-800'
        : 'border-white/8 hover:border-white/20'
    }`}>
      {highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="badge badge-purple px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-lg">
            <Zap size={10} className="mr-1" /> Most Popular
          </span>
        </div>
      )}

      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{plan.name}</p>
        <div className="flex items-end gap-1.5 mt-2">
          <span className="font-display text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-500 text-sm mb-1.5">/ {plan.durationInDays} days</span>
        </div>
      </div>

      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
            <Check size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {onSelect ? (
        <button onClick={() => onSelect(plan)} className={`w-full ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
          Choose {plan.name}
        </button>
      ) : user ? (
        <Link to="/member" className={`w-full text-center ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
          Get Started
        </Link>
      ) : (
        <Link to="/register" className={`w-full text-center ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
          Get Started
        </Link>
      )}
    </div>
  );
}
