const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-200 ${className}`}>
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;