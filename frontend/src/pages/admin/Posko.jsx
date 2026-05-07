import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Users, Plus, Edit2, Trash2, Info } from 'lucide-react';
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
  const { data: poskoList, isLoading } = useQuery({
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

  if (isLoading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Posko</h1>
          <p className="text-slate-500">Kelola lokasi pengungsian dan titik koordinasi.</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus size={18} />
          Tambah Posko
        </Button>
      </div>

      <Card>
        <Table headers={['Nama Posko', 'Bencana', 'Lokasi', 'Kapasitas', 'Pengungsi', 'Status', 'Aksi']}>
          {poskoList?.map((p) => (
            <tr key={p.id_posko}>
              <td className="px-6 py-4 font-medium text-slate-900">{p.nama_posko}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{p.Bencana?.nama_bencana || '-'}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{p.lokasi}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{p.kapasitas}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{p.jumlah_pengungsi}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  p.status === 'aktif' ? 'bg-green-100 text-green-700' : 
                  p.status === 'penuh' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button onClick={() => openModal(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id_posko)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedPosko ? 'Edit Posko' : 'Tambah Posko'}
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

          <Input
            label="Nama Posko"
            value={formData.nama_posko}
            onChange={(e) => setFormData({...formData, nama_posko: e.target.value})}
            placeholder="Contoh: Posko Balai Desa X"
            required
          />

          <Input
            label="Lokasi"
            value={formData.lokasi}
            onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
            placeholder="Alamat lengkap posko"
            required
            icon={<MapPin size={16} />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kapasitas (Orang)"
              type="number"
              value={formData.kapasitas}
              onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
              required
              icon={<Users size={16} />}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="aktif">Aktif</option>
                <option value="penuh">Penuh</option>
                <option value="tutup">Tutup</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Posko;