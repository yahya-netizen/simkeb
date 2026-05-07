import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';

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

  const { data: logistikList, isLoading } = useQuery({
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

  if (isLoading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Logistik</h1>
          <p className="text-slate-500">Catat bantuan masuk dan penyaluran barang bantuan.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Catat Transaksi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Item</p>
              <p className="text-2xl font-bold text-blue-900">{logistikList?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Riwayat Transaksi">
        <Table headers={['Tanggal', 'Bencana', 'Barang', 'Tipe', 'Jumlah', 'Satuan', 'Keterangan']}>
          {logistikList?.map((l) => (
            <tr key={l.id_barang}>
              <td className="px-6 py-4 text-sm text-slate-600">{new Date(l.createdAt).toLocaleDateString('id-ID')}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{l.Bencana?.nama_bencana || '-'}</td>
              <td className="px-6 py-4 font-medium text-slate-900">{l.nama_barang}</td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1 text-xs font-bold uppercase ${
                  l.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {l.tipe === 'masuk' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  {l.tipe}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-900">{l.jumlah}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{l.satuan}</td>
              <td className="px-6 py-4 text-sm text-slate-500 italic">{l.keterangan || '-'}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Transaksi Logistik"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Bencana</label>
            <select
              value={formData.bencanaId}
              onChange={(e) => setFormData({...formData, bencanaId: e.target.value})}
              className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">-- Pilih Bencana --</option>
              {bencanaList?.map(b => (
                <option key={b.id_bencana} value={b.id_bencana}>{b.nama_bencana}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama Barang"
              value={formData.nama_barang}
              onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
              placeholder="Contoh: Beras, Parasetamol"
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="makanan">Makanan</option>
                <option value="obat">Obat-obatan</option>
                <option value="pakaian">Pakaian</option>
                <option value="peralatan">Peralatan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({...formData, tipe: e.target.value})}
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="masuk" className="text-green-600">MASUK</option>
                <option value="keluar" className="text-red-600">KELUAR</option>
              </select>
            </div>
            <Input
              label="Jumlah"
              type="number"
              value={formData.jumlah}
              onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan (Opsional)</label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500"
              rows={2}
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Simpan Transaksi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Logistik;