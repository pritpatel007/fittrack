import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Zap, Shield, TrendingUp, Users, Star,
  Dumbbell, Clock, BarChart2, Award, CheckCircle2, ArrowRight
} from 'lucide-react';
import { planAPI, trainerAPI, classAPI } from '../../services/api';
import PlanCard from '../../components/public/PlanCard';
import TrainerCard from '../../components/public/TrainerCard';
import ClassCard from '../../components/public/ClassCard';

const features = [
  { icon: Zap,       title: 'Smart Scheduling',    desc: 'Book classes in seconds. Manage your fitness schedule with intelligent calendar integration.' },
  { icon: TrendingUp,title: 'Progress Analytics',  desc: 'Track weight, BMI, and body composition over time with beautiful visual charts.' },
  { icon: Shield,    title: 'Dedicated Trainers',  desc: 'Get personalized workout plans crafted by certified fitness professionals.' },
  { icon: BarChart2, title: 'Attendance Tracking', desc: 'Stay accountable with automated check-ins and attendance percentage reports.' },
  { icon: Users,     title: 'Community Classes',   desc: 'Join yoga, HIIT, Zumba, and more — with real-time capacity and booking.' },
  { icon: Award,     title: 'Membership Tiers',    desc: 'Flexible Basic, Standard, and Premium plans designed for every fitness journey.' },
];

const testimonials = [
  { name: 'Rachel K.', role: 'Member · 8 months', rating: 5, text: 'FitTrack completely changed how I approach fitness. Booking classes and seeing my progress charts keeps me motivated every single week.' },
  { name: 'Darius M.', role: 'Member · 1 year',   rating: 5, text: 'The workout plans from my trainer are right there in the app. I never have to guess what to do next at the gym.' },
  { name: 'Leila T.', role: 'Member · 4 months',  rating: 5, text: 'I lost 12kg tracking my progress on FitTrack. Seeing the BMI chart go down is genuinely addictive motivation.' },
];

export default function HomePage() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    planAPI.getActive().then(r => setPlans(r.data.plans)).catch(() => {});
    trainerAPI.getAll().then(r => setTrainers(r.data.trainers)).catch(() => {});
    classAPI.getAll({ upcoming: true }).then(r => setClasses(r.data.classes.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 noise">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
              <Zap size={13} /> The modern gym management platform
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Your Fitness Journey,{' '}
              <span className="gradient-text">Completely Managed</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              FitTrack brings together class booking, personal training, attendance tracking, and progress analytics — all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-7 py-3.5 shadow-lg shadow-brand-500/25">
                Start Your Journey <ChevronRight size={18} />
              </Link>
              <Link to="/plans" className="btn-secondary text-base px-7 py-3.5">
                View Plans
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/8">
              {[['500+', 'Active Members'], ['20+', 'Expert Trainers'], ['50+', 'Weekly Classes'], ['98%', 'Satisfaction Rate']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl font-bold text-white">{val}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="section-title">Built for Real Results</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">From day one to day one thousand, FitTrack has every tool you need to hit your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover p-6 group">
                <div className="w-11 h-11 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Membership</p>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.length > 0
              ? plans.map((plan, i) => <PlanCard key={plan._id} plan={plan} highlight={i === 1} />)
              : [1,2,3].map(i => (
                  <div key={i} className="card p-6 animate-pulse h-64">
                    <div className="h-4 bg-white/5 rounded mb-4 w-1/3" />
                    <div className="h-10 bg-white/5 rounded mb-6 w-1/2" />
                    {[1,2,3].map(j => <div key={j} className="h-3 bg-white/5 rounded mb-3" />)}
                  </div>
                ))
            }
          </div>

          <div className="text-center mt-8">
            <Link to="/plans" className="btn-ghost text-brand-400 hover:text-brand-300">
              Compare all features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trainers ────────────────────────────────────────────────── */}
      {trainers.length > 0 && (
        <section className="py-24 bg-dark-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Our Team</p>
                <h2 className="section-title">Expert Trainers</h2>
              </div>
              <Link to="/trainers" className="btn-ghost text-brand-400 hover:text-brand-300 hidden sm:flex">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trainers.slice(0, 3).map(t => <TrainerCard key={t._id} trainer={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Classes ─────────────────────────────────────────────────── */}
      {classes.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Schedule</p>
                <h2 className="section-title">Upcoming Classes</h2>
              </div>
              <Link to="/classes" className="btn-ghost text-brand-400 hover:text-brand-300 hidden sm:flex">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map(c => <ClassCard key={c._id} gymClass={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Success Stories</p>
            <h2 className="section-title">Members Love FitTrack</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, rating, text }) => (
              <div key={name} className="card p-6 hover:border-brand-500/30 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-10 md:p-14 border-brand-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-purple-600/5 pointer-events-none" />
            <div className="relative">
              <Dumbbell size={36} className="text-brand-400 mx-auto mb-5" />
              <h2 className="section-title text-4xl mb-4">Ready to Transform?</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Join thousands of members already achieving their fitness goals with FitTrack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-brand-500/25">
                  Get Started Free <ChevronRight size={18} />
                </Link>
                <Link to="/contact" className="btn-secondary text-base px-8 py-3.5">
                  Talk to Us
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-gray-500">
                {['No contracts', 'Cancel anytime', 'Free first week'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
