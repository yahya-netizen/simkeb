import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Users, FileText, MapPin, Calendar, Activity, LogIn, ChevronRight, Heart, Zap, Globe } from 'lucide-react';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import { formatDate } from '../../utils/format';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-red-50 to-gray-50 font-sans">
      {/* Emergency Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-red-900 py-24 sm:py-32 lg:py-40">
        {/* Animated Disaster Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[60%] bg-red-600/15 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-red-600/20 border-2 border-red-400/40 text-red-200 text-[11px] font-black uppercase tracking-[0.35em] mb-12 shadow-2xl backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-300"></span>
            </span>
            🚨 Emergency Response System 2.0
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] uppercase drop-shadow-2xl" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>
            Respon Cepat <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-red-400 to-orange-400 animate-pulse-alert">
              Aksi Nyata
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-red-100 max-w-3xl mx-auto mb-16 leading-relaxed font-bold uppercase text-[11px] tracking-[0.25em] opacity-90">
            🌍 Platform Koordinasi Bencana Alam | ⚡ Pelaporan Real-time | 📦 Manajemen Logistik Cerdas
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up">
            <button 
              className="group relative inline-flex items-center justify-center gap-3 h-20 px-14 text-lg font-black uppercase tracking-widest text-white bg-gradient-to-b from-red-600 to-red-700 rounded-xl overflow-hidden shadow-2xl shadow-red-600/40 transition-all hover:from-red-500 hover:to-red-600 hover:scale-110 active:scale-95 border-b-4 border-red-800"
              onClick={() => navigate('/lapor')}
            >
              <AlertCircle size={32} className="group-hover:animate-bounce" />
              <span>LAPOR BENCANA</span>
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              className="group inline-flex items-center justify-center gap-3 h-20 px-14 text-lg font-black uppercase tracking-widest text-white bg-white/10 border-2 border-white/30 rounded-xl shadow-xl backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 hover:scale-110 active:scale-95"
              onClick={() => navigate('/login')}
            >
              <Heart size={32} className="text-red-300" />
              <span>RELAWAN</span>
            </button>
          </div>
        </div>
      </section>

      {/* Situasi Terkini Section */}
      <section className="py-32 relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-16 rounded-2xl shadow-2xl border-4 border-red-200">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8 pb-8 border-b-4 border-red-100">
              <div>
                <h2 className="text-6xl md:text-7xl font-black text-red-900 uppercase tracking-tight" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>Situasi Terkini</h2>
                <p className="text-red-700 mt-3 font-black uppercase text-xs tracking-[0.35em]">⚠️ Laporan Bencana Aktif di Lapangan</p>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.25em] shadow-lg border-2 border-red-200 alert-pulse">
                <Activity size={20} />
                Live Update
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl animate-pulse border-2 border-red-200"></div>
                ))}
              </div>
            ) : bencanaAktif?.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-10">
                {bencanaAktif.map(b => (
                  <div key={b.id_bencana} className="group bg-gradient-to-br from-white to-red-50/30 rounded-2xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-red-200 hover:border-red-500 hover:-translate-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-200/20 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                        b.status === 'aktif' ? 'bg-red-100 text-red-800 border-red-300 animate-pulse-alert shadow-lg shadow-red-200/50' : 'bg-orange-100 text-orange-800 border-orange-300'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Calendar size={16} /> {formatDate(b.tanggal_kejadian)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-red-900 mb-6 line-clamp-2 group-hover:text-red-700 transition-colors leading-tight uppercase tracking-tight" style={{fontFamily: 'Bebas Neue, sans-serif'}}>{b.nama_bencana}</h3>
                    
                    <div className="space-y-6 mb-10 relative z-10">
                      <div className="flex items-start gap-3 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                        <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" /> 
                        <span className="text-sm font-black text-red-900 uppercase tracking-tight leading-tight">{b.lokasi}</span>
                      </div>
                      <p className="text-sm text-red-700 line-clamp-3 italic leading-relaxed font-bold uppercase text-[9px] tracking-[0.15em] opacity-80">"{b.deskripsi}"</p>
                    </div>
                    
                    <div className="pt-8 border-t-4 border-red-200 flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2 text-[10px] font-black text-red-900 bg-red-100 px-5 py-2.5 rounded-lg border-2 border-red-300 uppercase tracking-[0.2em] shadow-sm">
                        <Users size={18} className="text-red-600"/> 
                        <span>{b.Poskos?.length || 0} POSKO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse-alert"></div>
                        <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em]">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-4 border-dashed border-green-300">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-white mb-10 shadow-2xl border-2 border-green-300">
                  <Shield size={56} className="text-emerald-600" />
                </div>
                <h3 className="text-4xl font-black text-green-900 mb-4 tracking-tight uppercase" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Situasi Terkendali</h3>
                <p className="text-green-700 font-black uppercase text-xs tracking-[0.3em] max-w-md mx-auto leading-relaxed">✓ Saat ini tidak ada laporan bencana aktif</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-white to-red-50 relative overflow-hidden border-t-4 border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-red-600 mb-6">⚡ Keunggulan Sistem</h2>
            <h2 className="text-6xl md:text-8xl font-black text-red-900 tracking-tight leading-none uppercase" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>Manajemen Bencana</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Zap, 
                title: 'Pelaporan Instan', 
                desc: 'Laporan langsung ke komando pusat tanpa birokrasi. Kecepatan adalah kunci penyelamatan.',
                color: 'from-red-600 to-red-700'
              },
              { 
                icon: Globe, 
                title: 'Respon Terpadu', 
                desc: 'Data real-time relawan & petugas dalam satu peta. Koordinasi sempurna untuk efisiensi maksimal.',
                color: 'from-orange-600 to-orange-700'
              },
              { 
                icon: Shield, 
                title: 'Verifikasi Data', 
                desc: 'Validasi tim lapangan untuk akurasi data. Memastikan respons tepat sasaran dan efektif.',
                color: 'from-red-700 to-red-800'
              }
            ].map((f, i) => (
              <div key={i} className="group p-12 bg-white rounded-2xl border-4 border-red-200 hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-200/10 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`h-28 w-28 bg-gradient-to-br ${f.color} text-white rounded-2xl flex items-center justify-center mb-12 shadow-2xl shadow-red-600/30 transform group-hover:scale-110 group-hover:-rotate-6 transition-all border-4 border-white relative z-10`}>
                  <f.icon size={56} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-red-900 uppercase tracking-tight" style={{fontFamily: 'Bebas Neue, sans-serif'}}>{f.title}</h3>
                <p className="text-red-700 leading-relaxed font-black text-xs uppercase tracking-[0.2em] opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 bg-gradient-to-b from-red-50 to-red-100">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-red-900 via-red-950 to-red-900 rounded-2xl p-16 sm:p-32 text-center relative overflow-hidden shadow-2xl border-4 border-red-800">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          <div className="relative z-10">
            <h2 className="text-5xl sm:text-8xl font-black text-white mb-8 tracking-tight uppercase leading-tight" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em'}}>Siap Membantu?</h2>
            <p className="text-red-200 text-[11px] font-black uppercase tracking-[0.4em] mb-16">🤝 Bergabung dengan jaringan relawan nasional yang siap tanggap darurat</p>
            <Button 
              size="lg" 
              className="bg-gradient-to-b from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 h-24 px-24 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-2xl shadow-red-600/40 transition-all border-b-4 border-red-800 hover:scale-110 active:scale-95"
              onClick={() => navigate('/daftar-relawan')}
            >
              Gabung Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;