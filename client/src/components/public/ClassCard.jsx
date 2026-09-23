import { Clock, Users, MapPin, Calendar } from 'lucide-react';

const categoryColors = {
  'Yoga':              'badge-blue',
  'HIIT':             'badge-red',
  'Cardio':           'badge-yellow',
  'Zumba':            'badge-purple',
  'Strength Training':'badge-green',
  'Pilates':          'badge-blue',
  'Boxing':           'badge-red',
};

export default function ClassCard({ gymClass, onBook, booked = false, showBook = false }) {
  const spotsLeft = gymClass.capacity - gymClass.enrolledMembers?.length;
  const isFull = spotsLeft <= 0;

  return (
    <div className="card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`badge ${categoryColors[gymClass.category] ?? 'badge-gray'} mb-2`}>
            {gymClass.category}
          </span>
          <h3 className="font-semibold text-white">{gymClass.name}</h3>
        </div>
        {isFull
          ? <span className="badge badge-red flex-shrink-0">Full</span>
          : <span className="badge badge-green flex-shrink-0">{spotsLeft} spots</span>
        }
      </div>

      {gymClass.description && (
        <p className="text-gray-400 text-sm line-clamp-2">{gymClass.description}</p>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-brand-400" />
          {new Date(gymClass.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-brand-400" />
          {gymClass.time} · {gymClass.duration}min
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={12} className="text-brand-400" />
          {gymClass.trainerId?.name || 'TBA'}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-brand-400" />
          {gymClass.location || 'Main Hall'}
        </div>
      </div>

      {showBook && onBook && (
        <button
          onClick={() => onBook(gymClass)}
          disabled={isFull || booked}
          className={`w-full mt-1 ${booked ? 'btn-secondary opacity-60 cursor-not-allowed' : isFull ? 'btn-secondary opacity-40 cursor-not-allowed' : 'btn-primary'}`}
        >
          {booked ? 'Booked ✓' : isFull ? 'Class Full' : 'Book Class'}
        </button>
      )}
    </div>
  );
}
