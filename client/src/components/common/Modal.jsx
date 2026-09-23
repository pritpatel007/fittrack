import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeMap[size]} card border border-white/12 shadow-2xl animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h3 className="font-display font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors">
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
