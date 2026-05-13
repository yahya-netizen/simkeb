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
  Clock
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Button from '../../component/ui/Button';
import { formatDate } from '../../utils/format';

const StatCard = ({ title, value, icon: Icon, colorClass, bgGradient }) => (
  <div className={`p-6 rounded-xl border-2 border-slate-200 shadow-sm ${bgGradient} relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
    <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
      <Icon size={120} className={colorClass.split(' ')[1]} />
    </div>
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-4 rounded-lg border-2 ${colorClass.replace('bg-', 'border-').split(' ')[0]} ${colorClass} shadow-inner`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-4xl font-heading text-slate-900">{value}</p>
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
      return res.data.slice(0, 5);
    }
  });

  if (loadingStats) {
    return <div className="animate-pulse space-y-6">
      <div className="h-24 bg-slate-100 rounded-xl border-2 border-slate-200"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl border-2 border-slate-200"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-slate-100 rounded-xl border-2 border-slate-200"></div>
        <div className="h-80 bg-slate-100 rounded-xl border-2 border-slate-200 lg:col-span-2"></div>
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-8 rounded-xl shadow-sm border-b-4 border-slate-200 border-2 border-slate-100">
        <div>
          <h1 className="text-3xl font-heading text-slate-900">Ringkasan Sistem</h1>
          <p className="text-slate-400 mt-1 font-bold uppercase text-[11px] tracking-[0.3em]">Status operasional penanganan bencana saat ini.</p>
        </div>
        <div className="text-[11px] font-bold text-slate-600 flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-lg border-2 border-slate-200 uppercase tracking-widest">
          <Clock size={16} className="text-primary-800" /> 
          <span>Update: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Bencana Aktif" 
          value={stats?.total_bencana_aktif || 0} 
          icon={AlertTriangle} 
          colorClass="bg-orange-50 text-orange-700" 
          bgGradient="bg-white"
        />
        <StatCard 
          title="Total Posko" 
          value={stats?.total_posko || 0} 
          icon={MapPin} 
          colorClass="bg-blue-50 text-blue-700" 
          bgGradient="bg-white"
        />
        <StatCard 
          title="Relawan Aktif" 
          value={stats?.total_relawan_aktif || 0} 
          icon={Users} 
          colorClass="bg-emerald-50 text-emerald-700" 
          bgGradient="bg-white"
        />
        <StatCard 
          title="Laporan Masuk" 
          value={stats?.total_laporan_masuk || 0} 
          icon={FileText} 
          colorClass="bg-slate-50 text-slate-700" 
          bgGradient="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Statistik Korban">
          <div className="space-y-5">
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-lg border-2 border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-800 text-white rounded-lg flex items-center justify-center shadow-lg"><Activity size={24} /></div>
                <span className="font-bold text-[11px] uppercase tracking-widest text-slate-500">Pengungsi</span>
              </div>
              <span className="text-3xl font-heading text-slate-900">{stats?.total_pengungsi || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-lg border-2 border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-800 text-white rounded-lg flex items-center justify-center shadow-lg"><HeartPulse size={24} /></div>
                <span className="font-bold text-[11px] uppercase tracking-widest text-slate-500">Luka-luka</span>
              </div>
              <span className="text-3xl font-heading text-slate-900">{stats?.total_luka || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-lg border-2 border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary-800 text-white rounded-lg flex items-center justify-center shadow-lg"><Skull size={24} /></div>
                <span className="font-bold text-[11px] uppercase tracking-widest text-slate-500">Meninggal</span>
              </div>
              <span className="text-3xl font-heading text-slate-900">{stats?.total_meninggal || 0}</span>
            </div>
          </div>
        </Card>

        <Card 
          title="Kejadian Bencana" 
          className="lg:col-span-2"
          extra={
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/bencana')}
            >
              Lihat Semua
            </Button>
          }
        >
          <Table headers={['Nama Bencana', 'Lokasi', 'Tanggal', 'Status']}>
            {loadingBencana ? (
              <tr><td colSpan="4" className="text-center py-12 text-slate-400 font-bold uppercase text-[10px]">Memuat data...</td></tr>
            ) : bencanaTerbaru?.length > 0 ? bencanaTerbaru.map(b => (
              <tr key={b.id_bencana} className="hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100" onClick={() => navigate(`/admin/bencana/${b.id_bencana}`)}>
                <td className="px-6 py-5 font-bold text-slate-900 text-sm">{b.nama_bencana}</td>
                <td className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{b.lokasi}</td>
                <td className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">{formatDate(b.tanggal_kejadian)}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block border-2 ${
                    b.status === 'aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center py-12 text-slate-400 font-bold uppercase text-[10px]">Data Kosong.</td></tr>
            )}
          </Table>
        </Card>
      </div>

      <div className="bg-primary-950 rounded-xl p-12 shadow-2xl text-white relative overflow-hidden border-4 border-slate-900">
        <div className="relative z-10">
          <h2 className="text-2xl font-heading mb-10 border-b-2 border-white/5 pb-6">Aksi Cepat Manajemen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { 
                label: 'Data Bencana', 
                desc: 'Kelola Kejadian', 
                icon: AlertTriangle, 
                path: '/admin/bencana',
                color: 'hover:bg-primary-800'
              },
              { 
                label: 'Verifikasi', 
                desc: 'Laporan Masuk', 
                icon: FileText, 
                path: '/admin/laporan',
                color: 'hover:bg-blue-900'
              },
              { 
                label: 'Logistik', 
                desc: 'Stok Bantuan', 
                icon: Package, 
                path: '/admin/logistik',
                color: 'hover:bg-emerald-900'
              }
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)} 
                className={`p-8 bg-white/5 border-2 border-white/10 rounded-xl ${action.color} transition-all duration-300 text-left group`}
              >
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <action.icon size={24} className="text-white" />
                </div>
                <h4 className="font-bold text-base text-white mb-2 uppercase tracking-widest">{action.label}</h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;