import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, ArrowUpRight, ArrowDownLeft, RefreshCcw, History, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';
import { formatDate } from '../../utils/format';

const Logistik = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bencanaId: '',
    nama_barang: '',
    jenis: 'makanan',
    satuan: '',
    stok: 0,
    tipe: 'masuk',
    jumlah: 0,
    keterangan: ''
  });

  const { data: logistikList, isLoading, refetch } = useQuery({
    queryKey: ['logistik-all'],
    queryFn: async () => {
      const res = await api.get('/logistik');
      return res.data;
    }
  });

  const { data: bencanaList } = useQuery({
    queryKey: ['bencana-aktif'],
    queryFn: async () => {
      const res = await api.get('/bencana/aktif');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => api.post('/logistik', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['logistik-all']);
      toast.success('Transaksi logistik berhasil dicatat');
      setIsModalOpen(false);
      setFormData({
        bencanaId: '',
        nama_barang: '',
        jenis: 'makanan',
        satuan: '',
        stok: 0,
        tipe: 'masuk',
        jumlah: 0,
        keterangan: ''
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 bg-slate-100 rounded-xl border-2 border-slate-200" />
      <div className="h-24 bg-slate-100 rounded-xl border-2 border-slate-200" />
      <div className="h-[400px] bg-slate-100 rounded-xl border-2 border-slate-200" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Manajemen Logistik</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Pantau stok barang bantuan dan catat transaksi penyaluran.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary-600 shadow-primary-600/20">
            <Plus size={18} className="mr-2" /> Catat Transaksi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-xl shadow-lg shadow-primary-600/20 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform border-2 border-primary-500">
          <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Package size={120} />
          </div>
          <div className="relative z-10">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-4 border border-white/30">
              <Package size={24} />
            </div>
            <p className="text-primary-100 text-[10px] font-black uppercase tracking-[0.2em]">Total Item Barang</p>
            <p className="text-4xl font-black mt-1">{logistikList?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 shadow-sm flex items-center gap-6 group">
          <div className="h-16 w-16 bg-slate-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-slate-200">
            <ArrowDownLeft size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Transaksi Masuk</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{logistikList?.filter(l => l.tipe === 'masuk').length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 shadow-sm flex items-center gap-6 group">
          <div className="h-16 w-16 bg-slate-100 text-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-slate-200">
            <ArrowUpRight size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Transaksi Keluar</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{logistikList?.filter(l => l.tipe === 'keluar').length || 0}</p>
          </div>
        </div>
      </div>

      <Card title="Riwayat Transaksi Logistik">
        <Table headers={['Tanggal', 'Bencana & Keterangan', 'Nama Barang', 'Tipe', 'Jumlah', 'Satuan', 'Aksi']}>
          {logistikList?.map((l) => (
            <tr key={l.id_barang} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-slate-500">{formatDate(l.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900 truncate max-w-[200px]">{l.Bencana?.nama_bencana || 'Kebutuhan Umum'}</div>
                <div className="text-[10px] text-slate-400 font-bold mt-0.5 italic truncate max-w-[200px]">"{l.keterangan || '-'}"</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{l.nama_barang}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Tag size={10} className="text-primary-500" />
                  <span className="text-[10px] font-black uppercase text-slate-400">{l.jenis}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  l.tipe === 'masuk' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {l.tipe === 'masuk' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  {l.tipe}
                </span>
              </td>
              <td className="px-6 py-4 font-black text-slate-900">{l.jumlah}</td>
              <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{l.satuan}</td>
              <td className="px-6 py-4">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-primary-600">Detail</Button>
              </td>
            </tr>
          ))}
          {(!logistikList || logistikList.length === 0) && (
            <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-400 italic font-medium bg-slate-50/30">Belum ada catatan transaksi logistik.</td></tr>
          )}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Transaksi Logistik"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} isLoading={mutation.isPending}>Simpan Transaksi</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Tujukan ke Bencana</label>
            <select
              value={formData.bencanaId}
              onChange={(e) => setFormData({...formData, bencanaId: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              required
            >
              <option value="">-- Pilih Bencana Aktif --</option>
              {bencanaList?.map(b => (
                <option key={b.id_bencana} value={b.id_bencana}>{b.nama_bencana}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Nama Barang"
              value={formData.nama_barang}
              onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
              placeholder="Misal: Beras 50kg, Masker..."
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Kategori</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              >
                <option value="makanan">Makanan</option>
                <option value="obat">Obat-obatan</option>
                <option value="pakaian">Pakaian</option>
                <option value="peralatan">Peralatan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
             <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Jenis Alur</label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({...formData, tipe: e.target.value})}
                className={`w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 font-black focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer ${
                  formData.tipe === 'masuk' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                <option value="masuk">MASUK</option>
                <option value="keluar">KELUAR</option>
              </select>
            </div>
            <Input
              label="Jumlah"
              type="number"
              value={formData.jumlah}
              onChange={(e) => setFormData({...formData, jumlah: parseInt(e.target.value) || 0})}
              required
            />
            <Input
              label="Satuan"
              value={formData.satuan}
              onChange={(e) => setFormData({...formData, satuan: e.target.value})}
              placeholder="Kg, Box, Pcs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Keterangan Tambahan (Opsional)</label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-24 font-medium"
              rows={2}
              placeholder="Catatan sumber bantuan atau tujuan penyaluran..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Logistik;