const Card = ({ children, title, extra, footer, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {(title || extra) && (
        <div className="px-6 py-5 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/30">
          {title && <h3 className="text-xl font-heading text-slate-900">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-5 border-t-2 border-slate-200 bg-slate-50/80">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;