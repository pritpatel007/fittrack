import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser(data);
      toast.success('Account created! Welcome to FitTrack 🎉');
      navigate('/member');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
            <Dumbbell size={22} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Start your fitness journey with FitTrack</p>
        </div>

        <div className="card p-7 border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Jane Smith"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="jane@example.com"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input pr-11 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Min. 6 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="555-0100" {...register('phone')} />
              </div>
              <div>
                <label className="label">Age</label>
                <input type="number" className="input" placeholder="25" {...register('age', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Gender</label>
                <select className="input" {...register('gender')}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Fitness Goal</label>
                <select className="input" {...register('fitnessGoal')}>
                  <option value="">Select goal</option>
                  <option value="Lose weight">Lose weight</option>
                  <option value="Build muscle">Build muscle</option>
                  <option value="Improve endurance">Improve endurance</option>
                  <option value="Increase flexibility">Increase flexibility</option>
                  <option value="General fitness">General fitness</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
