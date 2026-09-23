import { useEffect, useState } from 'react';
import { trainerAPI } from '../../services/api';
import TrainerCard from '../../components/public/TrainerCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainerAPI.getAll()
      .then(r => setTrainers(r.data.trainers))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Our Team</p>
          <h1 className="section-title mb-4">Expert Trainers</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Certified professionals committed to helping you achieve real results.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : trainers.length === 0 ? (
          <p className="text-center text-gray-500">No trainers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map(t => <TrainerCard key={t._id} trainer={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}
