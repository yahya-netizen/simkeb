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
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Input from '../../component/ui/Input';
import Modal from '../../component/ui/Modal';
import { useState } from 'react';

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

  if (isLoading) return <div className="p-8 text-center animate-pulse">Memuat detail bencana...</div>;
  if (!bencana) return <div className="p-8 text-center text-red-500">Bencana tidak ditemukan.</div>;

  const korban = bencana.Korbans?.[0] || { jumlah_meninggal: 0, jumlah_luka: 0, jumlah_pengungsi: 0, jumlah_hilang: 0 };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/bencana')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{bencana.nama_bencana}</h1>
          <p className="text-slate-500 flex items-center gap-1">
            <Calendar size={14} /> {new Date(bencana.tanggal_kejadian).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Informasi Kejadian">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis Bencana</p>
                <p className="text-lg font-medium text-slate-900">{bencana.jenis}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tingkat Keparahan</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mt-1 ${
                  bencana.tingkat_parah === 'kritis' ? 'bg-red-100 text-red-700' :
                  bencana.tingkat_parah === 'berat' ? 'bg-orange-100 text-orange-700' :
                  bencana.tingkat_parah === 'sedang' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {bencana.tingkat_parah}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lokasi</p>
                <p className="text-slate-900 flex items-center gap-1"><MapPin size={16} className="text-slate-400" /> {bencana.lokasi}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi</p>
                <p className="text-slate-700 mt-1 leading-relaxed">{bencana.deskripsi || 'Tidak ada deskripsi.'}</p>
              </div>
            </div>
          </Card>

          <Card title="Daftar Posko" extra={
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/posko')}>Kelola Posko</Button>
          }>
            <Table headers={['Nama Posko', 'Lokasi', 'Pengungsi', 'Status']}>
              {bencana.Poskos?.map(p => (
                <tr key={p.id_posko}>
                  <td className="px-6 py-4 font-medium text-slate-900">{p.nama_posko}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.lokasi}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.jumlah_pengungsi}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!bencana.Poskos || bencana.Poskos.length === 0) && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">Belum ada posko terdaftar.</td></tr>
              )}
            </Table>
          </Card>
        </div>

        {/* Sidebar Statistics */}
        <div className="space-y-6">
          <Card title="Statistik Korban" extra={
            <button onClick={handleOpenKorbanModal} className="text-primary-600 hover:text-primary-700 text-sm font-semibold">Update</button>
          }>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Pengungsi</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{korban.jumlah_pengungsi}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HeartPulse size={20} className="text-yellow-600" />
                  <span className="text-sm font-medium text-slate-700">Luka-luka</span>
                </div>
                <span className="text-xl font-bold text-yellow-700">{korban.jumlah_luka}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skull size={20} className="text-red-600" />
                  <span className="text-sm font-medium text-slate-700">Meninggal</span>
                </div>
                <span className="text-xl font-bold text-red-700">{korban.jumlah_meninggal}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Hilang</span>
                </div>
                <span className="text-xl font-bold text-slate-700">{korban.jumlah_hilang}</span>
              </div>
            </div>
            {korban.keterangan && (
              <div className="mt-4 p-3 bg-slate-100 rounded text-xs text-slate-600 italic">
                <strong>Ket:</strong> {korban.keterangan}
              </div>
            )}
          </Card>

          <Card title="Logistik Terakhir">
             <div className="space-y-3">
                {bencana.Logistiks?.slice(0, 5).map(l => (
                  <div key={l.id_barang} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <div>
                      <p className="font-medium text-slate-900">{l.nama_barang}</p>
                      <p className={`text-[10px] font-bold uppercase ${l.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>{l.tipe}</p>
                    </div>
                    <p className="font-bold">{l.jumlah} <span className="text-slate-500 font-normal">{l.satuan}</span></p>
                  </div>
                ))}
                {(!bencana.Logistiks || bencana.Logistiks.length === 0) && (
                  <p className="text-center text-slate-400 text-sm italic py-4">Belum ada data logistik.</p>
                )}
                <Button variant="ghost" size="sm" className="w-full text-primary-600" onClick={() => navigate('/admin/logistik')}>Lihat Semua Logistik</Button>
             </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isKorbanModalOpen}
        onClose={() => setIsKorbanModalOpen(false)}
        title="Update Data Korban"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          <Input
            label="Keterangan"
            value={korbanData.keterangan}
            onChange={(e) => setKorbanData({...korbanData, keterangan: e.target.value})}
            placeholder="Misal: Data per tanggal 06 Mei"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsKorbanModalOpen(false)}>Batal</Button>
            <Button onClick={() => updateKorbanMutation.mutate(korbanData)} isLoading={updateKorbanMutation.isPending}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailBencana;