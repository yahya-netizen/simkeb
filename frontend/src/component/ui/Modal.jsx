import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border-2 border-slate-400">
        <div className="flex items-center justify-between px-8 py-6 border-b-2 border-slate-300 bg-slate-100">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-950 transition-all border-2 border-transparent hover:border-slate-300"
          >
            <X size={22} />
          </button>
        </div>
        <div className="px-8 py-8 max-h-[75vh] overflow-y-auto font-bold text-slate-700">
          {children}
        </div>
        {footer && (
          <div className="px-8 py-6 border-t-2 border-slate-300 bg-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;