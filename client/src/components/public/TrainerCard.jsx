import { Star, Award } from 'lucide-react';

export default function TrainerCard({ trainer }) {
  const { name, avatar } = trainer;
  const profile = trainer.profile;

  return (
    <div className="card-hover p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/20 overflow-hidden flex-shrink-0">
          {avatar || profile?.image
            ? <img src={avatar || profile?.image} alt={name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-brand-400 font-display font-bold text-2xl">
                {name?.[0]?.toUpperCase()}
              </div>
          }
        </div>
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-medium">{profile?.rating ?? '4.8'}</span>
            <span className="text-gray-500 text-xs">· {profile?.experience ?? 0} yrs exp.</span>
          </div>
        </div>
      </div>

      {profile?.bio && (
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{profile.bio}</p>
      )}

      {profile?.specialization?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.specialization.map((s) => (
            <span key={s} className="badge badge-purple text-xs">{s}</span>
          ))}
        </div>
      )}

      {profile?.certifications?.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Award size={12} className="text-amber-400" />
          {profile.certifications.slice(0, 2).join(' · ')}
        </div>
      )}
    </div>
  );
}
