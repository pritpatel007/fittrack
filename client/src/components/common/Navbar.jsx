import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { to: '/about',    label: 'About' },
  { to: '/plans',    label: 'Plans' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/classes',  label: 'Classes' },
  { to: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const dashboardLink =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'trainer' ? '/trainer' : '/member';

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Dumbbell size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">FitTrack</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to={dashboardLink} className="btn-secondary text-sm py-2 px-4">Dashboard</Link>
                <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4 text-gray-400">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white p-1">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/8 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/8 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dashboardLink} onClick={() => setOpen(false)} className="btn-secondary text-sm justify-center">Dashboard</Link>
                <button onClick={handleLogout} className="btn-ghost text-sm text-gray-400">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm justify-center">Sign in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm justify-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
