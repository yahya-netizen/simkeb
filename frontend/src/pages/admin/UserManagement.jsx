import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCog, Plus, Trash2, Shield, User, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    no_hp: '',
    role: 'petugas',
    email: '', // for admin
    NIP: '',   // for petugas
    instansi: '' // for petugas
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-all'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => api.post('/auth/register', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users-all']);
      toast.success('User berhasil ditambahkan');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan user');
    }
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      nama_lengkap: '',
      no_hp: '',
      role: 'petugas',
      email: '',
      NIP: '',
      instansi: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center">Memuat data user...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen User</h1>
          <p className="text-slate-500">Kelola akun administrator dan petugas lapangan.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Tambah User
        </Button>
      </div>

      <Card>
        <Table headers={['Username', 'Nama Lengkap', 'No HP', 'Role', 'Status']}>
          {users?.map((u) => (
            <tr key={u.id}>
              <td className="px-6 py-4 font-medium text-slate-900">{u.username}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{u.nama_lengkap}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{u.no_hp}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  u.role === 'petugas' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {u.role === 'admin' ? <Shield size={12} /> : u.role === 'petugas' ? <UserCheck size={12} /> : <User size={12} />}
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-green-600 font-medium">Aktif</td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah User Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              required
            />
            <Input
              label="Nomor HP"
              value={formData.no_hp}
              onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="admin">Administrator</option>
              <option value="petugas">Petugas Lapangan</option>
            </select>
          </div>

          {formData.role === 'admin' && (
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          )}

          {formData.role === 'petugas' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="NIP"
                value={formData.NIP}
                onChange={(e) => setFormData({...formData, NIP: e.target.value})}
                required
              />
              <Input
                label="Instansi"
                value={formData.instansi}
                onChange={(e) => setFormData({...formData, instansi: e.target.value})}
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" isLoading={mutation.isPending}>Simpan User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;