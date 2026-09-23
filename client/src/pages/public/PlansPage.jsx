// PlansPage.jsx
import { useEffect, useState } from 'react';
import { planAPI } from '../../services/api';
import PlanCard from '../../components/public/PlanCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    planAPI.getActive()
      .then(r => setPlans(r.data.plans))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="section-title mb-4">Membership Plans</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Choose the plan that fits your goals. Upgrade or cancel anytime.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => <PlanCard key={plan._id} plan={plan} highlight={i === 1} />)}
          </div>
        )}
      </div>
    </div>
  );
}
