import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10 bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-fade-in">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Portal Petugas</h2>
          <p className="text-slate-500 font-medium">Gunakan akun resmi untuk akses manajemen sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username Petugas"
            placeholder="Masukkan username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoComplete="username"
            icon={<User size={18} className="text-slate-400" />}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
            icon={<Lock size={18} className="text-slate-400" />}
          />
          <button 
            type="submit" 
            className={`w-full h-14 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold text-lg rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.3)] transition-all flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;