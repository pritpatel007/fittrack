import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Trainers', to: '/trainers' },
    { label: 'Contact', to: '/contact' },
  ],
  Membership: [
    { label: 'Pricing Plans', to: '/plans' },
    { label: 'Classes', to: '/classes' },
    { label: 'Register', to: '/register' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-850 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Dumbbell size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">FitTrack</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The all-in-one gym management platform built for modern fitness centers and their members.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-600/30 flex items-center justify-center text-gray-400 hover:text-brand-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-white font-semibold text-sm mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with React + Node.js + MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
