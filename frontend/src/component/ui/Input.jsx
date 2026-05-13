const Input = ({ label, error, required = false, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`flex h-13 w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-5 py-3 text-sm text-slate-900 font-semibold ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/10 focus-visible:border-primary-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
          error ? 'border-red-600 bg-red-50 focus-visible:ring-red-500/10 focus-visible:border-red-600' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 font-black uppercase tracking-tighter ml-1">{error}</p>}
    </div>
  );
};

export default Input;