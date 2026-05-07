import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';

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
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary-100">
        <div className="text-center mb-8">
          <div className="h-14 w-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={30} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Login Relawan</h2>
          <p className="text-slate-500 mt-2">Masuk untuk melihat penugasan Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username Relawan"
            placeholder="Masukkan username Anda"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoComplete="username"
            icon={<User size={16} className="text-slate-400" />}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
            icon={<Lock size={16} className="text-slate-400" />}
          />
          <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6" isLoading={loading}>
            Masuk Sekarang
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <div className="text-center">
             <p className="text-sm text-slate-500 mb-2">Belum terdaftar sebagai relawan?</p>
             <Button 
                variant="outline" 
                className="w-full gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
                onClick={() => navigate('/daftar-relawan')}
              >
                <UserPlus size={18} />
                Daftar Jadi Relawan
              </Button>
          </div>
          
          <button 
            onClick={() => navigate('/login-petugas')} 
            className="w-full text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            Anda Petugas? Login di sini
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;