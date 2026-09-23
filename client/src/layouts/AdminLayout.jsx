import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, CreditCard,
  CalendarDays, BookOpen, ClipboardList, Menu
} from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const links = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',      icon: Users,           label: 'Users' },
  { to: '/admin/trainers',   icon: UserCheck,       label: 'Trainers' },
  { to: '/admin/plans',      icon: CreditCard,      label: 'Membership Plans' },
  { to: '/admin/classes',    icon: CalendarDays,    label: 'Classes' },
  { to: '/admin/bookings',   icon: BookOpen,        label: 'Bookings' },
  { to: '/admin/attendance', icon: ClipboardList,   label: 'Attendance' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:flex lg:z-auto transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <DashboardSidebar links={links} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-dark-850 border-b border-white/8">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-white">FitTrack Admin</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
