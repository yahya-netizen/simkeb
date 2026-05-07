import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const DaftarRelawan = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    no_hp: '',
    no_identitas: '',
    keahlian: 'rescue/p3k',
    keahlian_lainnya: '',
    role: 'relawan'
  });
  const [loading, setLoading] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/relawan/daftar', formData);
      setSuccessMode(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  if (successMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 animate-fade-in font-sans">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500 animate-slide-up" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Terima kasih telah bergabung menjadi pahlawan kemanusiaan. Akun relawan Anda telah aktif.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full h-12 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:-translate-y-1"
          >
            Lanjut ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans relative">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-80 sm:h-96 bg-primary-600 z-0 rounded-b-[40px] sm:rounded-b-[80px]"></div>

      <div className="max-w-3xl mx-auto animate-fade-in relative z-10">
        <div className="mb-10 text-center text-white pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">Bergabung Menjadi Relawan</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium">Bantu sesama dalam masa krisis. Daftarkan diri Anda ke dalam sistem koordinasi relawan terpusat.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-4 animate-slide-up">
            <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 text-sm mb-1">Keamanan Data Terjamin</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Data Nomor Identitas Kependudukan (NIK) Anda dilindungi enkripsi end-to-end dan hanya digunakan untuk keperluan verifikasi identitas di lapangan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Informasi Akun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Username <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="username"
                  placeholder="Pilih username unik"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Gunakan password yang kuat"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-8">Identitas Pribadi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama_lengkap"
                  placeholder="Sesuai KTP"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Nomor HP <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="no_hp"
                  placeholder="Contoh: 081234567xxx"
                  value={formData.no_hp}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Nomor Identitas (NIK) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="no_identitas"
                placeholder="16 digit NIK Anda"
                value={formData.no_identitas}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Keahlian Khusus</label>
              <select
                name="keahlian"
                value={formData.keahlian}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium appearance-none"
              >
                <option value="rescue/p3k">Rescue / P3K</option>
                <option value="tim dapur">Tim Dapur Umum</option>
                <option value="tim logistik">Tim Logistik</option>
                <option value="psikolog">Psikolog / Trauma Healing</option>
                <option value="penghibur anak2">Penghibur Anak-anak</option>
                <option value="lainnya">Lainnya...</option>
              </select>
            </div>

            {formData.keahlian === 'lainnya' && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-sm font-bold text-slate-700">Sebutkan Keahlian Anda <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="keahlian_lainnya"
                  placeholder="Misal: Supir Truk, Pertukangan, Manajemen Data"
                  value={formData.keahlian_lainnya}
                  onChange={handleChange}
                  required={formData.keahlian === 'lainnya'}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                />
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full h-14 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold text-lg rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.3)] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus size={22} />
                    Daftar Menjadi Relawan
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 font-medium pt-4">
              Sudah punya akun? <button type="button" onClick={() => navigate('/login')} className="text-primary-600 font-bold hover:text-primary-700 hover:underline">Login di sini</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DaftarRelawan;