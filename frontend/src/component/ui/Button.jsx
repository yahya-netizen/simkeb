const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold tracking-tight transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 disabled:pointer-events-none disabled:opacity-60 border-2';

  const variants = {
    primary: 'bg-primary-900 text-white border-primary-900 hover:bg-primary-800 shadow-lg shadow-primary-900/20',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 shadow-sm',
    outline: 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 hover:border-primary-900 shadow-sm',
    danger: 'bg-red-700 text-white border-red-700 hover:bg-red-800 shadow-lg shadow-red-900/20',
    ghost: 'hover:bg-slate-100 text-slate-600 shadow-none border-transparent hover:border-slate-200',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-13 px-8 text-base',
  };

  const isButtonDisabled = isLoading || disabled;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isButtonDisabled}
      {...props}
    >
      {isLoading ? (
        <svg className="mr-2 h-4 w-4 animate-spin text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;