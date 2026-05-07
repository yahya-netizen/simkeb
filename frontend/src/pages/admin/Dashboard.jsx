import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  FileText, 
  Activity,
  HeartPulse,
  Skull,
  ArrowRight,
  Clock,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';

const StatCard = ({ title, value, icon: Icon, colorClass, bgGradient }) => (
  <div className={`p-6 rounded-3xl shadow-sm border border-slate-100 ${bgGradient} relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
    <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <Icon size={100} className={colorClass.split(' ')[1]} />
    </div>
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-4 rounded-2xl ${colorClass} shadow-inner`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-4xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-ringkasan'],
    queryFn: async () => {
      const res = await api.get('/dashboard/ringkasan');
      return res.data;
    }
  });

  const { data: bencanaTerbaru, isLoading: loadingBencana } = useQuery({
    queryKey: ['bencana-terbaru'],
    queryFn: async () => {
      const res = await api.get('/bencana');
      return res.data.slice(0, 5); // Ambil 5 terbaru
    }
  });

  if (loadingStats) {
    return <div className="animate-pulse space-y-6">
      <div className="h-20 bg-slate-200 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-slate-200 rounded-3xl"></div>
        <div className="h-80 bg-slate-200 rounded-3xl lg:col-span-2"></div>
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Ringkasan</h1>
          <p className="text-slate-500 mt-1 font-medium">Gambaran umum situasi kebencanaan terkini.</p>
        </div>
        <div className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Clock size={16} className="text-primary-500" /> 
          <span>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Bencana Aktif" 
          value={stats?.total_bencana_aktif || 0} 
          icon={AlertTriangle} 
          colorClass="bg-orange-100 text-orange-600" 
          bgGradient="bg-gradient-to-br from-white to-orange-50/50"
        />
        <StatCard 
          title="Total Posko" 
          value={stats?.total_posko || 0} 
          icon={MapPin} 
          colorClass="bg-blue-100 text-blue-600" 
          bgGradient="bg-gradient-to-br from-white to-blue-50/50"
        />
        <StatCard 
          title="Relawan Bertugas" 
          value={stats?.total_relawan_aktif || 0} 
          icon={Users} 
          colorClass="bg-emerald-100 text-emerald-600" 
          bgGradient="bg-gradient-to-br from-white to-emerald-50/50"
        />
        <StatCard 
          title="Laporan Masuk" 
          value={stats?.total_laporan_masuk || 0} 
          icon={FileText} 
          colorClass="bg-purple-100 text-purple-600" 
          bgGradient="bg-gradient-to-br from-white to-purple-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Statistik Korban Total</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-inner"><Activity size={24} /></div>
                <span className="font-bold text-slate-700">Pengungsi</span>
              </div>
              <span className="text-3xl font-extrabold text-blue-900">{stats?.total_pengungsi || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl shadow-inner"><HeartPulse size={24} /></div>
                <span className="font-bold text-slate-700">Luka-luka</span>
              </div>
              <span className="text-3xl font-extrabold text-yellow-900">{stats?.total_luka || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-inner"><Skull size={24} /></div>
                <span className="font-bold text-slate-700">Meninggal</span>
              </div>
              <span className="text-3xl font-extrabold text-red-900">{stats?.total_meninggal || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Kejadian Bencana Terbaru</h2>
            <button 
              onClick={() => navigate('/admin/bencana')} 
              className="px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              Lihat Semua <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-100 flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-700 text-sm tracking-wider uppercase">Nama Bencana</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-sm tracking-wider uppercase">Lokasi</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-sm tracking-wider uppercase">Tanggal</th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-sm tracking-wider uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingBencana ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500 font-medium">Memuat data...</td></tr>
                ) : bencanaTerbaru?.length > 0 ? bencanaTerbaru.map(b => (
                  <tr key={b.id_bencana} className="hover:bg-slate-50/80 cursor-pointer transition-colors" onClick={() => navigate(`/admin/bencana/${b.id_bencana}`)}>
                    <td className="px-6 py-4 font-bold text-slate-900">{b.nama_bencana}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{b.lokasi}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{new Date(b.tanggal_kejadian).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-block ${
                        b.status === 'aktif' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500 font-medium">Belum ada data bencana.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/admin/bencana')} 
            className="p-5 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-left group hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform"><Plus size={48} /></div>
            <div className="h-12 w-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Tambah Data Bencana</h4>
            <p className="text-sm text-slate-300 font-medium">Input kejadian bencana baru ke sistem untuk segera ditangani.</p>
          </button>
          
          <button 
            onClick={() => navigate('/admin/laporan')} 
            className="p-5 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-left group hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform"><FileText size={48} /></div>
            <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Activity size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Verifikasi Laporan</h4>
            <p className="text-sm text-slate-300 font-medium">Tinjau laporan masuk dari masyarakat untuk validasi data.</p>
          </button>
          
          <button 
            onClick={() => navigate('/admin/logistik')} 
            className="p-5 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 text-left group hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform"><AlertTriangle size={48} /></div>
            <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <FileText size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-lg text-white mb-2">Update Logistik</h4>
            <p className="text-sm text-slate-300 font-medium">Kelola stok barang bantuan dan pantau distribusinya ke posko.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;