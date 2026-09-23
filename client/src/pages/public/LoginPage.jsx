import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'trainer') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
            <Dumbbell size={22} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Sign in to your FitTrack account</p>
        </div>

        <div className="card p-7 border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pr-11 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 p-4 rounded-xl bg-dark-850 border border-white/5 text-xs text-gray-500 space-y-1">
            <p className="text-gray-400 font-medium mb-2">Demo Credentials:</p>
            <p>👑 Admin: admin@fittrack.com</p>
            <p>💪 Trainer: marcus@fittrack.com</p>
            <p>🏃 Member: james@fittrack.com</p>
            <p className="text-gray-600 mt-1">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
