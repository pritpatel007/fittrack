import { Dumbbell } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeMap[size]} border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center gap-4 z-50">
        <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-2">
          <Dumbbell size={24} className="text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading FitTrack…</p>
      </div>
    );
  }

  return spinner;
}
