import { useEffect, useState } from 'react';
import { classAPI } from '../../services/api';
import ClassCard from '../../components/public/ClassCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Yoga', 'HIIT', 'Cardio', 'Zumba', 'Strength Training', 'Pilates', 'Boxing'];

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    classAPI.getAll()
      .then(r => setClasses(r.data.classes))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? classes : classes.filter(c => c.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Schedule</p>
          <h1 className="section-title mb-4">All Classes</h1>
          <p className="text-gray-400 max-w-lg mx-auto">From yoga to HIIT — find the class that matches your energy.</p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white border border-white/8'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No classes found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => <ClassCard key={c._id} gymClass={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
