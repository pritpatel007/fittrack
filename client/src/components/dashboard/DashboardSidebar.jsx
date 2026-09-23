import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, LogOut, X } from 'lucide-react';

export default function DashboardSidebar({ links, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-dark-850 border-r border-white/8">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Dumbbell size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">FitTrack</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : <span className="text-brand-400 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            onClick={onClose}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/8">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
