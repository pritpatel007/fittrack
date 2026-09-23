import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, User, CalendarCheck, ClipboardList, Dumbbell, TrendingUp, Menu } from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const links = [
  { to: '/member',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/member/profile',    icon: User,            label: 'My Profile' },
  { to: '/member/bookings',   icon: CalendarCheck,   label: 'Class Bookings' },
  { to: '/member/attendance', icon: ClipboardList,   label: 'Attendance' },
  { to: '/member/workout',    icon: Dumbbell,        label: 'Workout Plan' },
  { to: '/member/progress',   icon: TrendingUp,      label: 'Progress' },
];

export default function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - mobile slide-in */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:flex lg:z-auto transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <DashboardSidebar links={links} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-dark-850 border-b border-white/8">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-white">FitTrack</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
