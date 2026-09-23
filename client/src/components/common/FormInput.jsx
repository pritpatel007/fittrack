export default function FormInput({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`} {...props} />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <select className={`input ${error ? 'border-red-500' : ''}`} {...props}>
        {children}
      </select>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <textarea
        className={`input resize-none ${error ? 'border-red-500' : ''}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
