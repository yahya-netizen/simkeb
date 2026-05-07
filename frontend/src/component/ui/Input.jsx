const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base text-slate-900 font-semibold ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
          error ? 'border-red-500 focus-visible:ring-red-500/50' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;