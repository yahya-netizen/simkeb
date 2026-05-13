import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Package, 
  Activity, 
  HeartPulse, 
  Skull,
  Plus,
  ArrowLeft,
  Calendar,
  Settings,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Input from '../../component/ui/Input';
import Modal from '../../component/ui/Modal';
import { useState } from 'react';
import { formatDate } from '../../utils/format';

const DetailBencana = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isKorbanModalOpen, setIsKorbanModalOpen] = useState(false);
  const [korbanData, setKorbanData] = useState({
    jumlah_meninggal: 0,
    jumlah_luka: 0,
    jumlah_pengungsi: 0,
    jumlah_hilang: 0,
    keterangan: ''
  });

  const { data: bencana, isLoading } = useQuery({
    queryKey: ['bencana-detail', id],
    queryFn: async () => {
      const res = await api.get(`/bencana/${id}`);
      return res.data;
    }
  });

  const updateKorbanMutation = useMutation({
    mutationFn: async (data) => api.post(`/korban`, { ...data, bencanaId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bencana-detail', id]);
      toast.success('Data korban diperbarui');
      setIsKorbanModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui data korban');
    }
  });

  const handleOpenKorbanModal = () => {
    if (bencana?.Korbans?.[0]) {
      const k = bencana.Korbans[0];
      setKorbanData({
        jumlah_meninggal: k.jumlah_meninggal,
        jumlah_luka: k.jumlah_luka,
        jumlah_pengungsi: k.jumlah_pengungsi,
        jumlah_hilang: k.jumlah_hilang,
        keterangan: k.keterangan || ''
      });
    }
    setIsKorbanModalOpen(true);
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 bg-slate-100 rounded-xl border-2 border-slate-200" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-slate-100 rounded-xl border-2 border-slate-200" />
        <div className="h-[400px] bg-slate-100 rounded-xl border-2 border-slate-200" />
      </div>
    </div>
  );
  
  if (!bencana) return (
    <div className="p-20 text-center bg-white rounded-xl shadow-sm border-2 border-slate-200">
      <div className="h-20 w-20 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Bencana Tidak Ditemukan</h2>
      <p className="text-slate-500 mb-8 font-bold uppercase text-[10px] tracking-widest">Data yang Anda cari mungkin sudah dihapus atau tidak pernah ada.</p>
      <Button onClick={() => navigate('/admin/bencana')}>Kembali ke Daftar</Button>
    </div>
  );

  const korban = bencana.Korbans?.[0] || { jumlah_meninggal: 0, jumlah_luka: 0, jumlah_pengungsi: 0, jumlah_hilang: 0 };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 rounded-xl shadow-sm border-2 border-slate-200 border-b-4 border-slate-300">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/bencana')} 
            className="h-14 w-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all border border-slate-100 active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{bencana.nama_bencana}</h1>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">
                {bencana.status}
              </span>
            </div>
            <p className="text-slate-500 flex items-center gap-2 font-bold text-sm">
              <Calendar size={16} className="text-primary-500" /> 
              {formatDate(bencana.tanggal_kejadian)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-slate-200">
            <Settings size={18} className="mr-2" /> Pengaturan
          </Button>
          <Button className="bg-emerald-600 shadow-emerald-600/20">
            <ShieldCheck size={18} className="mr-2" /> Validasi Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Informasi Kejadian">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Bencana</p>
                <p className="text-xl font-bold text-slate-900">{bencana.jenis}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Keparahan</p>
                <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider mt-1 ${
                  bencana.tingkat_parah === 'kritis' ? 'bg-red-100 text-red-700' :
                  bencana.tingkat_parah === 'berat' ? 'bg-orange-100 text-orange-700' :
                  bencana.tingkat_parah === 'sedang' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {bencana.tingkat_parah}
                </span>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi Kejadian</p>
                <p className="text-slate-900 font-bold flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  {bencana.lokasi}
                </p>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Kondisi</p>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 font-medium leading-relaxed italic">{bencana.deskripsi || 'Tidak ada deskripsi tambahan.'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Daftar Posko Terdekat" extra={
            <Button size="sm" variant="ghost" onClick={() => navigate('/admin/posko')} className="text-primary-600 font-black">Kelola Semua Posko</Button>
          }>
            <Table headers={['Nama Posko', 'Kapasitas', 'Pengungsi', 'Status']}>
              {bencana.Poskos?.map(p => (
                <tr key={p.id_posko} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.nama_posko}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{p.lokasi}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{p.kapasitas}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{p.jumlah_pengungsi}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!bencana.Poskos || bencana.Poskos.length === 0) && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic font-medium bg-slate-50/30">Belum ada posko yang terdaftar untuk bencana ini.</td></tr>
              )}
            </Table>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Statistik Korban" extra={
            <Button size="sm" variant="ghost" onClick={handleOpenKorbanModal} className="text-primary-600 font-black">Update</Button>
          }>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Pengungsi</span>
                </div>
                <span className="text-2xl font-black text-blue-700">{korban.jumlah_pengungsi}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50 group hover:bg-yellow-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <HeartPulse size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Luka-luka</span>
                </div>
                <span className="text-2xl font-black text-yellow-700">{korban.jumlah_luka}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50 group hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Skull size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Meninggal</span>
                </div>
                <span className="text-2xl font-black text-red-700">{korban.jumlah_meninggal}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white text-slate-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Hilang</span>
                </div>
                <span className="text-2xl font-black text-slate-700">{korban.jumlah_hilang}</span>
              </div>
            </div>
            {korban.keterangan && (
              <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-[11px] text-slate-400 font-medium leading-relaxed border border-slate-800">
                <strong className="text-primary-400 uppercase tracking-widest block mb-1">Catatan Petugas:</strong> 
                {korban.keterangan}
              </div>
            )}
          </Card>

          <Card title="Logistik Terakhir">
             <div className="space-y-4">
                {bencana.Logistiks?.slice(0, 5).map(l => (
                  <div key={l.id_barang} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{l.nama_barang}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${l.tipe === 'masuk' ? 'text-emerald-600' : 'text-red-600'}`}>{l.tipe}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{l.jumlah}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{l.satuan}</p>
                    </div>
                  </div>
                ))}
                {(!bencana.Logistiks || bencana.Logistiks.length === 0) && (
                  <div className="py-10 text-center">
                    <div className="h-12 w-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package size={24} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold italic">Belum ada transaksi logistik.</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full font-black text-[10px] uppercase tracking-widest py-4" onClick={() => navigate('/admin/logistik')}>Lihat Semua Logistik</Button>
             </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isKorbanModalOpen}
        onClose={() => setIsKorbanModalOpen(false)}
        title="Update Statistik Korban"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsKorbanModalOpen(false)}>Batal</Button>
            <Button onClick={() => updateKorbanMutation.mutate(korbanData)} isLoading={updateKorbanMutation.isPending}>Simpan Perubahan</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Jumlah Pengungsi"
              type="number"
              value={korbanData.jumlah_pengungsi}
              onChange={(e) => setKorbanData({...korbanData, jumlah_pengungsi: parseInt(e.target.value) || 0})}
            />
            <Input
              label="Jumlah Luka-luka"
              type="number"
              value={korbanData.jumlah_luka}
              onChange={(e) => setKorbanData({...korbanData, jumlah_luka: parseInt(e.target.value) || 0})}
            />
            <Input
              label="Jumlah Meninggal"
              type="number"
              value={korbanData.jumlah_meninggal}
              onChange={(e) => setKorbanData({...korbanData, jumlah_meninggal: parseInt(e.target.value) || 0})}
            />
            <Input
              label="Jumlah Hilang"
              type="number"
              value={korbanData.jumlah_hilang}
              onChange={(e) => setKorbanData({...korbanData, jumlah_hilang: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Keterangan Tambahan</label>
            <textarea
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-28 font-medium"
              value={korbanData.keterangan}
              onChange={(e) => setKorbanData({...korbanData, keterangan: e.target.value})}
              placeholder="Misal: Update data per tanggal 13 Mei..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailBencana;