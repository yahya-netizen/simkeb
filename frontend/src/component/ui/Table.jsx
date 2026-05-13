const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border-2 border-slate-300 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-5 font-bold text-slate-600 text-[11px] tracking-widest uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200 bg-white font-medium">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;