import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';

const StaffLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      const user = res.data.user;
      
      if (user.role !== 'admin' && user.role !== 'petugas') {
        toast.error('Akses ditolak. Halaman ini hanya untuk Petugas/Admin.');
        return;
      }

      setAuth(user, res.data.token);
      toast.success('Login Petugas berhasil!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Decorative background for authoritative feel */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800 rounded-full blur-[120px]"></div>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm transition-all active:scale-95 group"
      >
        <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all">
          <ArrowLeft size={18} />
        </div>
        Kembali ke Beranda
      </button>

      <div className="w-full max-w-md z-10 bg-white rounded-xl shadow-2xl p-10 border-4 border-slate-400 animate-fade-in">
        <div className="text-center mb-10">
          <div className="h-20 w-20 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3 border-4 border-slate-800">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Portal Petugas</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Official System Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username Resmi"
            placeholder="Username Petugas"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoComplete="username"
          />
          <Input
            label="Password Keamanan"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
          />
          <Button 
            type="submit" 
            className="w-full h-14 bg-slate-950 hover:bg-black text-white font-black text-lg rounded-lg shadow-xl shadow-slate-950/20 uppercase tracking-widest border-2 border-slate-900" 
            isLoading={loading}
          >
            Masuk Sekarang
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-slate-100 text-center">
           <div className="flex items-center justify-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
             <div className="h-0.5 w-6 bg-slate-200"></div>
             Security Protocol
             <div className="h-0.5 w-6 bg-slate-200"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;