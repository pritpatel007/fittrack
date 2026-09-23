import { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BookOpen } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getAll()
      .then(r => setBookings(r.data.bookings))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">All Bookings</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-850 border-b border-white/8">
              <tr>
                {['Member', 'Class', 'Category', 'Date', 'Status', 'Booked On'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-10">No bookings yet.</td></tr>
              ) : bookings.map(b => (
                <tr key={b._id} className="hover:bg-white/2">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                        {b.userId?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{b.userId?.name}</span>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-gray-200">{b.classId?.name}</td>
                  <td className="table-cell"><span className="badge badge-purple">{b.classId?.category}</span></td>
                  <td className="table-cell">{b.classId?.date ? new Date(b.classId.date).toLocaleDateString() : '—'}</td>
                  <td className="table-cell">
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'attended' ? 'badge-blue' : 'badge-red'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
