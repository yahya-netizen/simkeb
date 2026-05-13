import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCog, Plus, Trash2, Shield, User, UserCheck, RefreshCcw, Mail, Phone, Fingerprint, Building2 } from 'lucide-react';
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

  const { data: users, isLoading, refetch } = useQuery({
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
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen User</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola akun administrator, petugas lapangan, dan hak akses sistem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary-600 shadow-primary-600/20">
            <Plus size={18} className="mr-2" /> Tambah User
          </Button>
        </div>
      </div>

      <Card>
        <Table headers={['Identitas User', 'Username & HP', 'Role', 'Status', 'Aksi']}>
          {users?.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{u.nama_lengkap}</div>
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                  <Mail size={10} />
                  <span className="text-[10px] font-bold">{u.Admin?.email || u.Petugas?.instansi || 'Public User'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-700">{u.username}</div>
                <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                  <Phone size={10} />
                  <span className="text-[10px] font-bold">{u.no_hp}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                  u.role === 'petugas' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {u.role === 'admin' ? <Shield size={12} /> : u.role === 'petugas' ? <UserCheck size={12} /> : <User size={12} />}
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Aktif</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">Nonaktifkan</Button>
              </td>
            </tr>
          ))}
          {(!users || users.length === 0) && (
            <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic font-medium bg-slate-50/30">Belum ada user yang terdaftar di sistem.</td></tr>
          )}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah User Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} isLoading={mutation.isPending}>Simpan User</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="user123"
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Nama Lengkap"
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              placeholder="Nama sesuai identitas"
              required
            />
            <Input
              label="Nomor HP / WhatsApp"
              value={formData.no_hp}
              onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
              placeholder="0812xxxx"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Pilih Role Akses</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="petugas">Petugas Lapangan (Operational)</option>
            </select>
          </div>

          {formData.role === 'admin' && (
            <Input
              label="Alamat Email Admin"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="admin@simkeb.id"
              required
            />
          )}

          {formData.role === 'petugas' && (
            <div className="grid grid-cols-2 gap-5 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 animate-fade-in">
              <Input
                label="Nomor Induk Pegawai (NIP)"
                value={formData.NIP}
                onChange={(e) => setFormData({...formData, NIP: e.target.value})}
                placeholder="198xxxx"
                required
              />
              <Input
                label="Instansi Terkait"
                value={formData.instansi}
                onChange={(e) => setFormData({...formData, instansi: e.target.value})}
                placeholder="BPBD / SAR"
                required
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;