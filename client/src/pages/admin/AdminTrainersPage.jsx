import { useEffect, useState } from 'react';
import { trainerAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TrainerCard from '../../components/public/TrainerCard';
import { UserCheck } from 'lucide-react';

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainerAPI.getAll()
      .then(r => setTrainers(r.data.trainers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">Trainers</h1>
      {trainers.length === 0 ? (
        <div className="card p-12 text-center">
          <UserCheck size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No trainers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map(t => <TrainerCard key={t._id} trainer={t} />)}
        </div>
      )}
    </div>
  );
}
