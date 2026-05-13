import { useState } from 'react';
import { Camera, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';

const LaporBencana = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    jenis: '',
    lokasi: '',
    tingkat_keparahan: 'ringan',
    deskripsi: '',
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMode, setSuccessMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (foto) data.append('foto', foto);

    try {
      await api.post('/laporan', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMode(true);
      setFormData({
        nama_pelapor: '',
        jenis: '',
        lokasi: '',
        tingkat_keparahan: 'ringan',
        deskripsi: '',
      });
      setFoto(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  if (successMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center py-12 px-4 animate-fade-in font-sans">
        <div className="max-w-md w-full bg-white p-12 rounded-2xl shadow-2xl text-center border-4 border-green-300">
          <div className="w-28 h-28 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-green-100">
            <CheckCircle2 size={56} className="text-green-600 animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-green-900 mb-4 uppercase tracking-tight" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>✓ Laporan Terkirim!</h2>
          <p className="text-green-700 mb-12 leading-relaxed font-bold uppercase text-xs tracking-[0.2em] opacity-90">
            🎯 Informasi Anda sangat berharga. Laporan telah masuk ke sistem koordinasi pusat untuk ditindaklanjuti.
          </p>
          <div className="space-y-4">
            <Button onClick={() => setSuccessMode(false)} className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-xl shadow-lg shadow-green-600/30 uppercase tracking-wider">Kirim Laporan Lain</Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full text-green-700 font-black uppercase text-[10px] tracking-[0.2em] hover:text-green-900">← Kembali ke Beranda</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 py-12 px-4 font-sans relative overflow-hidden">
      {/* Disaster theme background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-3xl mx-auto animate-fade-in relative z-10">
        <div className="mb-12 flex flex-col items-center">
           <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-red-700 hover:text-red-900 font-black uppercase text-xs mb-10 transition-all active:scale-95 group self-start"
          >
            <div className="h-10 w-10 bg-white shadow-sm border-2 border-red-200 rounded-lg flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-300 transition-all">
              <ArrowLeft size={18} />
            </div>
            ← Beranda
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-900 to-red-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl border-2 border-red-700 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-300"></span>
              </span>
              🚨 Emergency Disaster Reporting
            </div>
            <h1 className="text-5xl sm:text-8xl font-black text-red-900 tracking-tight mb-4 leading-none uppercase" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>Form Laporan Bencana</h1>
            <p className="text-red-700 max-w-2xl mx-auto text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">⚡ Sampaikan Informasi Akurat untuk Respons Cepat Penanganan Bencana</p>
          </div>
        </div>

        <Card className="rounded-2xl p-6 sm:p-12 border-4 border-red-200 shadow-2xl relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-100/30 rounded-bl-full -z-10 opacity-50 blur-2xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Pelapor"
                name="nama_pelapor"
                placeholder="Nama Lengkap"
                value={formData.nama_pelapor}
                onChange={handleChange}
                required
              />
              <Input
                label="Jenis Bencana"
                name="jenis"
                placeholder="Banjir, Gempa, dsb."
                value={formData.jenis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Lokasi Kejadian <span className="text-red-500">*</span></label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors text-slate-400">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  name="lokasi"
                  placeholder="Alamat lengkap atau titik koordinat..."
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  className="w-full h-14 pl-14 pr-5 rounded-lg border-2 border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all font-black text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Tingkat Keparahan <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-4">
                {['ringan', 'sedang', 'kritis'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({...formData, tingkat_keparahan: lvl})}
                    className={`h-14 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border-2 transition-all active:scale-95 ${
                      formData.tingkat_keparahan === lvl
                        ? lvl === 'ringan' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 shadow-lg shadow-yellow-500/10' :
                          lvl === 'sedang' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-lg shadow-orange-500/10' :
                          'bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-500/10'
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Bukti Visual (Foto)</label>
              <div className={`mt-1 flex justify-center px-6 pt-12 pb-12 border-4 border-dashed rounded-xl transition-all cursor-pointer group hover:bg-slate-50 ${foto ? 'border-primary-500 bg-primary-50/10' : 'border-slate-300 hover:border-slate-500'}`}>
                <div className="space-y-4 text-center">
                  <Camera className={`mx-auto h-14 w-14 ${foto ? 'text-primary-600 animate-pulse' : 'text-slate-200 group-hover:text-slate-300'} transition-all`} />
                  <div className="flex flex-col text-sm text-slate-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest text-[10px]">
                      <span>{foto ? 'Ganti Foto' : 'Ambil Foto / Pilih File'}</span>
                      <input id="file-upload" name="foto" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  {foto && (
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-primary-100 animate-slide-up">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-[10px] text-slate-700 font-black truncate max-w-[200px] uppercase">{foto.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Kronologi Kejadian <span className="text-red-500">*</span></label>
              <textarea
                name="deskripsi"
                rows={5}
                placeholder="Ceritakan kejadian dan bantuan yang paling dibutuhkan..."
                value={formData.deskripsi}
                onChange={handleChange}
                required
                className="w-full p-6 rounded-lg border-2 border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all font-bold text-base resize-none"
              ></textarea>
            </div>

            <Button 
              type="submit" 
              isLoading={loading}
              className="w-full h-16 bg-primary-600 text-white font-black text-lg rounded-lg shadow-2xl shadow-primary-600/30 uppercase tracking-[0.2em]"
            >
              Kirim Laporan Resmi
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LaporBencana;