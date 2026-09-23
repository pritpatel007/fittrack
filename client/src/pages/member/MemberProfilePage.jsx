import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MemberProfilePage() {
  const { user, updateLocalUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const { register, handleSubmit, reset } = useForm({ defaultValues: user });

  useEffect(() => { reset(user); }, [user]);

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') formData.append(k, v); });
      if (avatarFile) formData.append('avatar', avatarFile);
      const res = await userAPI.updateProfile(formData);
      updateLocalUser(res.data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // BMI calculator state
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const bmi = bmiWeight && bmiHeight
    ? (parseFloat(bmiWeight) / ((parseFloat(bmiHeight) / 100) ** 2)).toFixed(1)
    : null;
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const bmiColor = bmi < 18.5 ? 'text-sky-400' : bmi < 25 ? 'text-emerald-400' : bmi < 30 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="page-title">My Profile</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-brand-600/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="font-display text-2xl font-bold text-brand-400">{initials}</span>
                }
              </div>
              <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-500 transition-colors shadow-lg">
                <Camera size={12} className="text-white" />
                <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-gray-400 text-sm capitalize">{user?.role} · {user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register('phone')} />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" className="input" {...register('age', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" {...register('gender')}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
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

          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={16} /> {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* BMI Calculator */}
      <div className="card p-6">
        <h2 className="font-semibold text-white mb-4">BMI Calculator</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" className="input" placeholder="75" value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} />
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <input type="number" className="input" placeholder="175" value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} />
          </div>
        </div>
        {bmi && (
          <div className="p-4 rounded-xl bg-dark-850 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Your BMI</p>
              <p className={`font-display text-3xl font-bold mt-1 ${bmiColor}`}>{bmi}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs mb-1">Category</p>
              <p className={`font-semibold ${bmiColor}`}>{bmiCategory}</p>
            </div>
          </div>
        )}
        <div className="mt-3 grid grid-cols-4 gap-1 text-xs text-center text-gray-500">
          {[['<18.5','Underweight','sky'], ['18.5–24.9','Normal','emerald'], ['25–29.9','Overweight','amber'], ['≥30','Obese','red']].map(([range, label, color]) => (
            <div key={label} className="p-2 rounded-lg bg-dark-850">
              <p className={`font-medium text-${color}-400`}>{range}</p>
              <p className="mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
