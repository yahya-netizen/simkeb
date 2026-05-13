import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Users, Plus, Edit2, Trash2, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';

const Posko = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosko, setSelectedPosko] = useState(null);
  const [formData, setFormData] = useState({
    bencanaId: '',
    nama_posko: '',
    lokasi: '',
    kapasitas: 0,
    status: 'aktif'
  });

  // Fetch Posko
  const { data: poskoList, isLoading, refetch } = useQuery({
    queryKey: ['posko-all'],
    queryFn: async () => {
      const res = await api.get('/posko');
      return res.data;
    }
  });

  // Fetch Bencana for dropdown
  const { data: bencanaList } = useQuery({
    queryKey: ['bencana-aktif'],
    queryFn: async () => {
      const res = await api.get('/bencana/aktif');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (selectedPosko) {
        return api.put(`/posko/${selectedPosko.id_posko}`, data);
      }
      return api.post('/posko', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posko-all']);
      toast.success(selectedPosko ? 'Posko diperbarui' : 'Posko ditambahkan');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/posko/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['posko-all']);
      toast.success('Posko dihapus');
    }
  });

  const openModal = (posko = null) => {
    if (posko) {
      setSelectedPosko(posko);
      setFormData({
        bencanaId: posko.bencanaId,
        nama_posko: posko.nama_posko,
        lokasi: posko.lokasi,
        kapasitas: posko.kapasitas,
        status: posko.status
      });
    } else {
      setSelectedPosko(null);
      setFormData({
        bencanaId: bencanaList?.[0]?.id_bencana || '',
        nama_posko: '',
        lokasi: '',
        kapasitas: 0,
        status: 'aktif'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPosko(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus posko ini?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 bg-slate-100 rounded-xl border-2 border-slate-200" />
      <div className="h-[500px] bg-slate-100 rounded-xl border-2 border-slate-200" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Posko</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola lokasi pengungsian dan titik koordinasi bantuan.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh
          </Button>
          <Button onClick={() => openModal()} className="bg-primary-600 shadow-primary-600/20">
            <Plus size={18} className="mr-2" /> Tambah Posko
          </Button>
        </div>
      </div>

      <Card>
        <Table headers={['Nama Posko & Bencana', 'Lokasi', 'Kapasitas', 'Pengungsi', 'Status', 'Aksi']}>
          {poskoList?.map((p) => (
            <tr key={p.id_posko} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{p.nama_posko}</div>
                <div className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mt-0.5">{p.Bencana?.nama_bencana || 'Umum'}</div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-xs line-clamp-1">{p.lokasi}</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-600">{p.kapasitas}</td>
              <td className="px-6 py-4 text-sm font-black text-slate-900">{p.jumlah_pengungsi}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  p.status === 'aktif' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  p.status === 'penuh' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                  'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openModal(p)} className="text-blue-600 hover:bg-blue-50">
                    <Edit2 size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id_posko)} className="text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedPosko ? 'Edit Data Posko' : 'Tambah Posko Baru'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Batal</Button>
            <Button onClick={handleSubmit} isLoading={mutation.isPending}>Simpan Data</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Pilih Kejadian Bencana</label>
            <select
              value={formData.bencanaId}
              onChange={(e) => setFormData({...formData, bencanaId: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer transition-all"
              required
            >
              <option value="">-- Pilih Bencana --</option>
              {bencanaList?.map(b => (
                <option key={b.id_bencana} value={b.id_bencana}>{b.nama_bencana}</option>
              ))}
            </select>
          </div>

          <Input
            label="Nama Posko"
            value={formData.nama_posko}
            onChange={(e) => setFormData({...formData, nama_posko: e.target.value})}
            placeholder="Contoh: Posko Balai Desa X"
            required
          />

          <Input
            label="Alamat / Lokasi"
            value={formData.lokasi}
            onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
            placeholder="Alamat lengkap lokasi posko..."
            required
          />

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Kapasitas (Jiwa)"
              type="number"
              value={formData.kapasitas}
              onChange={(e) => setFormData({...formData, kapasitas: parseInt(e.target.value) || 0})}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Status Operasional</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer transition-all"
              >
                <option value="aktif">Aktif</option>
                <option value="penuh">Penuh</option>
                <option value="tutup">Tutup</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Posko;