import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';

const Login = () => {
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

      if (user.role !== 'relawan') {
        toast.error('Akun Anda bukan akun Relawan. Silakan login melalui Portal Petugas.');
        return;
      }

      setAuth(user, res.data.token);
      toast.success('Selamat datang, Relawan!');
      navigate('/admin/penugasan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 relative overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary-200 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm transition-all active:scale-95 group"
      >
        <div className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
          <ArrowLeft size={18} />
        </div>
        Kembali
      </button>

      <div className="w-full max-w-md z-10 bg-white rounded-xl shadow-2xl p-10 border-4 border-slate-200 animate-fade-in">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-primary-200">
            <Heart size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Portal Relawan</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Volunteer Access Point</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username Relawan"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoComplete="username"
          />
          <Input
            label="Password Akun"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
          />
          <Button 
            type="submit" 
            className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white font-black text-lg rounded-lg shadow-xl shadow-primary-500/20" 
            isLoading={loading}
          >
            Masuk Sekarang
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-slate-100 space-y-6">
          <div className="text-center bg-slate-100 p-6 rounded-lg border-2 border-slate-200">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Baru bergabung?</p>
             <Button 
                variant="outline" 
                className="w-full gap-2 border-2 border-primary-500 text-primary-700 bg-white hover:bg-primary-600 hover:text-white font-black py-4 rounded-lg shadow-lg"
                onClick={() => navigate('/daftar-relawan')}
              >
                <UserPlus size={18} />
                Daftar Relawan
              </Button>
          </div>
          
          <button 
            onClick={() => navigate('/login-petugas')} 
            className="w-full text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            Akses Petugas? Login di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;