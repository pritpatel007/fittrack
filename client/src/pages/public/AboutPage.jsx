import { Shield, Users, TrendingUp, Heart } from 'lucide-react';

const values = [
  { icon: Shield,    title: 'Integrity',    desc: 'We hold ourselves and our members to the highest standards of honesty and commitment.' },
  { icon: Users,     title: 'Community',    desc: 'Fitness is better together. We foster a welcoming, supportive environment for everyone.' },
  { icon: TrendingUp,title: 'Results',      desc: 'We are obsessed with outcomes. Every feature is designed to help you hit your goals faster.' },
  { icon: Heart,     title: 'Wellbeing',    desc: 'Beyond physical fitness — mental health, recovery, and balance are core to who we are.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-20">
        <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="section-title mb-6">Built by Fitness Enthusiasts,<br />for Fitness Enthusiasts</h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          FitTrack was founded with a simple belief: managing a gym shouldn't be complicated. We built the platform we always wished existed — combining member management, class booking, and performance tracking into one elegant system.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-dark-850 py-14 mb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['2020', 'Founded'], ['500+', 'Active Members'], ['20+', 'Trainers'], ['15+', 'Locations']].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-3xl font-bold text-white mb-1">{v}</p>
                <p className="text-gray-500 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-4xl">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover p-6 text-center">
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
