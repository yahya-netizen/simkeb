import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Users, FileText, MapPin, Calendar, Activity, LogIn, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../component/ui/Button';

const Landing = () => {
  const navigate = useNavigate();
  const { data: bencanaAktif, isLoading } = useQuery({
    queryKey: ['bencana-aktif-public'],
    queryFn: async () => {
      const res = await api.get('/bencana/aktif');
      return res.data;
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Hero Section with Premium Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 py-24 sm:py-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="absolute top-0 right-0 p-6 z-10">
           <button 
            onClick={() => navigate('/login-petugas')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors glass-panel px-4 py-2 rounded-full"
           >
             <Shield size={16} /> Portal Petugas
           </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-dark text-primary-300 text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Sistem Informasi Manajemen Kebencanaan
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Bersama Hadapi <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Bencana
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform terpadu untuk koordinasi penanganan bencana, pelaporan masyarakat secara real-time, dan manajemen logistik di wilayah Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <button 
              className="group relative inline-flex items-center justify-center gap-2 h-14 px-8 text-lg font-bold text-white bg-primary-600 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(234,88,12,0.3)] transition-all hover:bg-primary-500 hover:scale-105 active:scale-95"
              onClick={() => navigate('/lapor')}
            >
              <AlertCircle size={22} className="group-hover:animate-bounce" />
              <span>Lapor Bencana</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </button>
            
            <button 
              className="inline-flex items-center justify-center gap-2 h-14 px-8 text-lg font-bold text-slate-900 bg-white rounded-xl shadow-lg transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
              onClick={() => navigate('/login')}
            >
              <LogIn size={22} />
              <span>Login Relawan</span>
            </button>
          </div>
          
          <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <button 
              onClick={() => navigate('/daftar-relawan')} 
              className="text-primary-300 font-medium hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
             >
               Belum jadi relawan? Daftar di sini <ChevronRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* Situasi Terkini Section */}
      <section className="py-24 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel bg-white/80 p-8 rounded-3xl shadow-xl border border-slate-100/50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Situasi Terkini</h2>
                <p className="text-slate-500 mt-2 font-medium">Daftar kejadian bencana yang sedang ditangani saat ini.</p>
              </div>
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-red-100">
                <Activity size={18} className="animate-pulse" />
                Live Update
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : bencanaAktif?.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {bencanaAktif.map(b => (
                  <div key={b.id_bencana} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 cursor-default relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    
                    <div className="flex justify-between items-start mb-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        b.tingkat_parah === 'kritis' ? 'bg-red-100 text-red-700 border border-red-200' :
                        b.tingkat_parah === 'berat' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {b.tingkat_parah}
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <Calendar size={12} /> {new Date(b.tanggal_kejadian).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">{b.nama_bencana}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-medium text-slate-600 flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                        <MapPin size={16} className="text-primary-500 shrink-0 mt-0.5" /> 
                        <span className="line-clamp-2">{b.lokasi}</span>
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">"{b.deskripsi}"</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <Users size={16} className="text-blue-500"/> 
                        <span>{b.Poskos?.length || 0} Posko</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Aktif</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6 shadow-inner border border-green-100">
                  <Shield size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Situasi Aman</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">Alhamdulillah, saat ini tidak ada bencana aktif yang dilaporkan di sistem kami.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kenapa Menggunakan SIMKEB?</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Platform dirancang khusus untuk mempermudah alur informasi dan tindakan pada saat situasi genting.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 -z-10 transform -translate-y-1/2"></div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="h-16 w-16 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/30 transform group-hover:rotate-6 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Pelaporan Cepat</h3>
              <p className="text-slate-600 leading-relaxed">Laporkan kejadian bencana di sekitar Anda secara langsung tanpa proses rumit. Informasi Anda menyelamatkan nyawa.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 transform group-hover:-rotate-6 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Respon Terpadu</h3>
              <p className="text-slate-600 leading-relaxed">Koordinasi tim petugas, relawan, dan distribusi logistik yang lebih efektif dalam satu komando digital terpusat.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 transform group-hover:rotate-6 transition-transform">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Informasi Akurat</h3>
              <p className="text-slate-600 leading-relaxed">Dapatkan data terkini yang telah terverifikasi mengenai status bencana, lokasi posko, dan penyaluran bantuan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;