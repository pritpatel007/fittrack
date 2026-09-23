import { useEffect, useState } from 'react';
import { userAPI, progressAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ProgressChart from '../../components/dashboard/ProgressChart';
import { Users, TrendingUp } from 'lucide-react';

export default function TrainerMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberProgress, setMemberProgress] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    userAPI.getMembers()
      .then(r => setMembers(r.data.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const viewProgress = async (member) => {
    setSelectedMember(member);
    setProgressLoading(true);
    try {
      const res = await progressAPI.getMemberProgress(member._id);
      setMemberProgress(res.data.logs);
    } catch { setMemberProgress([]); }
    finally { setProgressLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">All Members</h1>
      <div className="card overflow-hidden">
        {members.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No members found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-850 border-b border-white/8">
                <tr>
                  {['Member', 'Email', 'Age', 'Fitness Goal', 'Joined', 'Progress'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map(m => (
                  <tr key={m._id} className="hover:bg-white/2">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs flex-shrink-0">
                          {m.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-400">{m.email}</td>
                    <td className="table-cell">{m.age ?? '—'}</td>
                    <td className="table-cell text-gray-300">{m.fitnessGoal ?? '—'}</td>
                    <td className="table-cell">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <button onClick={() => viewProgress(m)} className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs font-medium">
                        <TrendingUp size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={`${selectedMember?.name}'s Progress`}
        size="lg"
      >
        {progressLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : memberProgress.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No progress data for this member.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['Current Weight', `${memberProgress.slice(-1)[0]?.weight} kg`],
                ['Current BMI', memberProgress.slice(-1)[0]?.bmi],
                ['Total Logs', memberProgress.length],
              ].map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl bg-dark-850 border border-white/5">
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="text-white font-bold text-xl mt-1">{val}</p>
                </div>
              ))}
            </div>
            <ProgressChart data={memberProgress} />
          </div>
        )}
      </Modal>
    </div>
  );
}
