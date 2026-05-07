import { useState } from 'react';
import { AlertCircle, Camera, MapPin, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const LaporBencana = () => {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 animate-fade-in font-sans">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500 animate-slide-up" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Laporan Diterima!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Terima kasih atas informasinya. Laporan Anda telah masuk ke sistem dan akan segera diverifikasi oleh tim kami. Informasi Anda sangat berarti.
          </p>
          <button 
            onClick={() => setSuccessMode(false)}
            className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Kirim Laporan Lain
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
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">Form Pelaporan Bencana</h1>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg font-medium">Bantu kami merespon cepat dengan memberikan informasi yang akurat mengenai kejadian bencana di sekitar Anda.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Nama Pelapor <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama_pelapor"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama_pelapor}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Jenis Bencana <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="jenis"
                  placeholder="Contoh: Banjir, Kebakaran, Longsor"
                  value={formData.jenis}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Lokasi Kejadian <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-primary-500" />
                </div>
                <input
                  type="text"
                  name="lokasi"
                  placeholder="Alamat lengkap lokasi kejadian"
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tingkat Keparahan <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  name="tingkat_keparahan"
                  value={formData.tingkat_keparahan}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold text-base appearance-none cursor-pointer"
                >
                  <option value="ringan">Ringan (Kerusakan minim, tidak ada korban)</option>
                  <option value="sedang">Sedang (Kerusakan properti, evakuasi terbatas)</option>
                  <option value="kritis">Kritis (Kerusakan masif, butuh bantuan segera)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.tingkat_keparahan === 'ringan' ? 'bg-yellow-400' :
                    formData.tingkat_keparahan === 'sedang' ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
                  }`}></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Foto Lokasi (Opsional)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-colors cursor-pointer group hover:bg-primary-50/50 ${foto ? 'border-primary-400 bg-primary-50/30' : 'border-slate-300 hover:border-primary-400'}`}>
                <div className="space-y-2 text-center">
                  <Camera className={`mx-auto h-12 w-12 ${foto ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-400'} transition-colors`} />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>{foto ? 'Ubah Foto' : 'Pilih Foto dari Galeri'}</span>
                      <input id="file-upload" name="foto" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs font-medium text-slate-500">PNG, JPG up to 5MB</p>
                  {foto && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-primary-100">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-primary-700 font-semibold">{foto.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Deskripsi Kejadian <span className="text-red-500">*</span></label>
              <textarea
                name="deskripsi"
                rows={4}
                placeholder="Ceritakan kronologi singkat dan jenis bantuan darurat yang mungkin dibutuhkan..."
                value={formData.deskripsi}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-bold text-base resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-14 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white font-extrabold text-lg rounded-xl shadow-[0_4px_20px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={22} />
                  Kirim Laporan Bencana
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaporBencana;