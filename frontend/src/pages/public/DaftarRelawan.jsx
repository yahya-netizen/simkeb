import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, CheckCircle2, ArrowLeft, Heart, User, Phone, Fingerprint, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 animate-fade-in font-sans">
        <div className="max-w-md w-full bg-white p-12 rounded-xl shadow-2xl text-center border-2 border-slate-300">
          <div className="w-28 h-28 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-8 shadow-inner border-2 border-emerald-100">
            <CheckCircle2 size={56} className="text-emerald-500 animate-slide-up" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Registered!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-bold uppercase text-xs tracking-widest">
            Terima kasih telah mendedikasikan diri Anda. Akun relawan Anda telah berhasil dibuat. Silakan login untuk melihat penugasan.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full h-16 bg-primary-600 hover:bg-primary-500 text-white font-black text-lg rounded-lg shadow-xl shadow-primary-500/30"
          >
            Masuk ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 font-sans relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto animate-fade-in relative z-10">
        <div className="mb-12 flex flex-col items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm mb-10 transition-all active:scale-95 group self-start"
          >
            <div className="h-10 w-10 bg-white shadow-sm border-2 border-slate-200 rounded-lg flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
              <ArrowLeft size={18} />
            </div>
            Kembali
          </button>
          
          <div className="text-center">
            <div className="h-20 w-20 bg-primary-600 text-white rounded-lg flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 border-4 border-white">
              <Heart size={40} fill="currentColor" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-none text-center uppercase">Registrasi Relawan</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-bold uppercase text-xs tracking-[0.3em]">Bergabunglah dalam misi kemanusiaan terpadu.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Instructions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-950 text-white p-8 rounded-xl shadow-2xl relative overflow-hidden group border-2 border-slate-800">
               <div className="relative z-10">
                  <ShieldCheck className="h-12 w-12 text-primary-400 mb-6" />
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Privasi Data</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-bold uppercase tracking-widest opacity-80">
                    NIK dan data pribadi Anda dilindungi sistem enkripsi mutakhir. Hanya digunakan untuk validasi resmi.
                  </p>
                  <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14}/> Verifikasi Identitas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14}/> Koordinasi Pusat</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14}/> Respon Lapangan</li>
                  </ul>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl border-2 border-slate-300 shadow-sm">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Butuh Bantuan?</p>
               <p className="text-slate-600 text-xs font-black uppercase tracking-widest leading-none">Pusat Koordinasi:</p>
               <p className="text-primary-600 text-xl font-black mt-2 tracking-tighter">0800-1-SIMKEB</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-xl p-4 sm:p-10 border-2 border-slate-300 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                    <div className="h-8 w-8 bg-slate-100 text-slate-900 rounded flex items-center justify-center font-black text-xs border-2 border-slate-200">01</div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Kredensial Akun</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Username"
                      name="username"
                      placeholder="Username unik"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      placeholder="Min. 8 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs">02</div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Profil & Keahlian</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Lengkap"
                      name="nama_lengkap"
                      placeholder="Sesuai KTP"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Nomor WhatsApp"
                      name="no_hp"
                      placeholder="0812xxxx"
                      value={formData.no_hp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    label="Nomor Identitas (NIK)"
                    name="no_identitas"
                    placeholder="16 Digit NIK"
                    value={formData.no_identitas}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-slate-700 mb-1">Keahlian Utama</label>
                    <select
                      name="keahlian"
                      value={formData.keahlian}
                      onChange={handleChange}
                      className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="rescue/p3k">⛑️ Rescue / P3K</option>
                      <option value="tim dapur">🍳 Tim Dapur Umum</option>
                      <option value="tim logistik">📦 Tim Logistik</option>
                      <option value="psikolog">🧠 Psikolog / Trauma Healing</option>
                      <option value="penghibur anak2">🧸 Penghibur Anak-anak</option>
                      <option value="lainnya">✨ Lainnya...</option>
                    </select>
                  </div>

                  {formData.keahlian === 'lainnya' && (
                    <div className="animate-fade-in">
                      <Input
                        label="Sebutkan Keahlian Spesifik Anda"
                        name="keahlian_lainnya"
                        placeholder="Misal: Driver, Teknisi Listrik, dsb."
                        value={formData.keahlian_lainnya}
                        onChange={handleChange}
                        required={formData.keahlian === 'lainnya'}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    isLoading={loading}
                    className="w-full h-16 bg-slate-950 text-white font-black text-xl rounded-2xl shadow-2xl shadow-slate-950/20 active:scale-95 transition-all"
                  >
                    Daftar Sebagai Relawan
                  </Button>
                  <p className="text-center text-sm text-slate-400 font-bold mt-6 uppercase tracking-tighter">
                    Sudah terdaftar? <button type="button" onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-700 border-b-2 border-primary-600/20">Login di sini</button>
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarRelawan;