import { useEffect, useState } from 'react';
import { bookingAPI, classAPI } from '../../services/api';
import ClassCard from '../../components/public/ClassCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CalendarCheck, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MemberBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [booking, setBooking] = useState(false);

  const fetchData = () => {
    Promise.all([
      bookingAPI.getMine().then(r => setBookings(r.data.bookings)),
      classAPI.getAll({ upcoming: true }).then(r => setClasses(r.data.classes)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleBook = async (gymClass) => {
    setBooking(true);
    try {
      await bookingAPI.create({ classId: gymClass._id });
      toast.success(`Booked: ${gymClass.name}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(bookingId);
      toast.success('Booking cancelled');
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const bookedClassIds = new Set(bookings.filter(b => b.status === 'confirmed').map(b => b.classId?._id));

  const myUpcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.classId?.date) >= new Date());
  const myPast = bookings.filter(b => b.status !== 'confirmed' || new Date(b.classId?.date) < new Date());

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">Class Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/8 pb-0">
        {[['upcoming', 'My Upcoming'], ['history', 'History'], ['browse', 'Browse Classes']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === key
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {label}
            {key === 'upcoming' && myUpcoming.length > 0 && (
              <span className="ml-2 badge badge-purple">{myUpcoming.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* My upcoming */}
      {tab === 'upcoming' && (
        <div>
          {myUpcoming.length === 0 ? (
            <div className="card p-12 text-center">
              <CalendarCheck size={36} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No upcoming bookings. Browse available classes!</p>
              <button onClick={() => setTab('browse')} className="btn-primary text-sm mt-4">Browse Classes</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myUpcoming.map(b => (
                <div key={b._id} className="card p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="badge badge-blue text-xs mb-1.5">{b.classId?.category}</span>
                      <h3 className="font-semibold text-white">{b.classId?.name}</h3>
                    </div>
                    <span className="badge badge-green">confirmed</span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>📅 {new Date(b.classId?.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p>🕐 {b.classId?.time} · {b.classId?.duration} min</p>
                  </div>
                  <button onClick={() => handleCancel(b._id)} className="btn-danger text-xs w-full py-1.5">Cancel Booking</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="card overflow-hidden">
          {myPast.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No booking history yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-850 border-b border-white/8">
                  <tr>
                    {['Class', 'Category', 'Date', 'Time', 'Status'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myPast.map(b => (
                    <tr key={b._id} className="hover:bg-white/2">
                      <td className="table-cell font-medium text-white">{b.classId?.name}</td>
                      <td className="table-cell">{b.classId?.category}</td>
                      <td className="table-cell">{new Date(b.classId?.date).toLocaleDateString()}</td>
                      <td className="table-cell">{b.classId?.time}</td>
                      <td className="table-cell">
                        <span className={`badge ${b.status === 'cancelled' ? 'badge-red' : b.status === 'attended' ? 'badge-green' : 'badge-gray'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Browse */}
      {tab === 'browse' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="input pl-9"
              placeholder="Search classes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {filteredClasses.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No classes match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map(c => (
                <ClassCard
                  key={c._id}
                  gymClass={c}
                  onBook={handleBook}
                  booked={bookedClassIds.has(c._id)}
                  showBook
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
