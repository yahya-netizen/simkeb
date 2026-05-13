import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Edit2, Info, Trash2, RefreshCcw } from 'lucide-react';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';
import { formatDate } from '../../utils/format';

const Bencana = () => {
  const navigate = useNavigate();

  const { data: bencanaList, isLoading, refetch } = useQuery({
    queryKey: ['bencana-all'],
    queryFn: async () => {
      const res = await api.get('/bencana');
      return res.data;
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create'); // create | edit
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const jenisOptions = useMemo(
    () => ['Gempa', 'Banjir', 'Tanah Longsor', 'Kekeringan', 'Puting Beliung', 'Kebakaran Hutan'],
    []
  );
  const tingkatOptions = useMemo(
    () => [
      { label: 'Ringan', value: 'ringan' },
      { label: 'Sedang', value: 'sedang' },
      { label: 'Berat', value: 'berat' },
      { label: 'Kritis', value: 'kritis' },
    ],
    []
  );

  const [form, setForm] = useState({
    nama_bencana: '',
    jenis: 'Gempa',
    tingkat_parah: 'sedang',
    lokasi: '',
    koordinat: '',
    deskripsi: '',
    tanggal_kejadian: '',
  });

  const openCreate = () => {
    setMode('create');
    setSelectedId(null);
    setForm({
      nama_bencana: '',
      jenis: 'Gempa',
      tingkat_parah: 'sedang',
      lokasi: '',
      koordinat: '',
      deskripsi: '',
      tanggal_kejadian: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setMode('edit');
    setSelectedId(row.id_bencana);

    setForm({
      nama_bencana: row.nama_bencana ?? '',
      jenis: row.jenis ?? 'Gempa',
      tingkat_parah: row.tingkat_parah ?? 'sedang',
      lokasi: row.lokasi ?? '',
      koordinat: row.koordinat ?? '',
      deskripsi: row.deskripsi ?? '',
      tanggal_kejadian: row.tanggal_kejadian ? String(row.tanggal_kejadian).slice(0, 10) : '',
    });

    setIsModalOpen(true);
  };

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await api.post('/bencana', form);
      } else {
        if (!selectedId) throw new Error('ID bencana tidak ditemukan');
        await api.put(`/bencana/${selectedId}`, form);
      }
      setIsModalOpen(false);
      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rowId) => {
    if (!window.confirm('Hapus data bencana ini?')) return;
    try {
      await api.delete(`/bencana/${rowId}`);
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-20 bg-slate-100 rounded-xl border-2 border-slate-200" />
        <div className="h-[500px] bg-slate-100 rounded-xl border-2 border-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Bencana</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola data kejadian bencana aktif dan historis.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh
          </Button>
          <Button onClick={openCreate} className="bg-primary-600 shadow-primary-600/20">
            <Plus size={18} className="mr-2" /> Tambah Bencana
          </Button>
        </div>
      </div>

      <Card>
        <Table headers={['Nama Bencana', 'Jenis', 'Tingkat', 'Lokasi', 'Tanggal Kejadian', 'Aksi']}>
          {(bencanaList || []).map((row) => (
            <tr key={row.id_bencana} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{row.nama_bencana}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">#{row.id_bencana}</div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.jenis}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  row.tingkat_parah === 'kritis' ? 'bg-red-100 text-red-700' :
                  row.tingkat_parah === 'berat' ? 'bg-orange-100 text-orange-700' :
                  row.tingkat_parah === 'sedang' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {row.tingkat_parah}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.lokasi}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-500">
                {formatDate(row.tanggal_kejadian)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(row)} className="text-blue-600 hover:bg-blue-50">
                    <Edit2 size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/bencana/${row.id_bencana}`)} className="text-primary-600 hover:bg-primary-50">
                    <Info size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id_bencana)} className="text-red-600 hover:bg-red-50">
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
        onClose={() => !submitting && setIsModalOpen(false)}
        title={mode === 'create' ? 'Tambah Bencana Baru' : 'Edit Data Bencana'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>Batal</Button>
            <Button onClick={handleSubmit} isLoading={submitting}>Simpan Data</Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Nama Bencana"
            value={form.nama_bencana}
            onChange={(e) => onChange('nama_bencana', e.target.value)}
            placeholder="Contoh: Gempa Bumi"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Jenis Bencana</label>
              <select
                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
                value={form.jenis}
                onChange={(e) => onChange('jenis', e.target.value)}
              >
                {jenisOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Tingkat Keparahan</label>
              <select
                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
                value={form.tingkat_parah}
                onChange={(e) => onChange('tingkat_parah', e.target.value)}
              >
                {tingkatOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Lokasi"
            value={form.lokasi}
            onChange={(e) => onChange('lokasi', e.target.value)}
            placeholder="Contoh: Kabupaten X"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Koordinat"
              value={form.koordinat}
              onChange={(e) => onChange('koordinat', e.target.value)}
              placeholder="-7.123, 112.456"
            />
            <Input
              label="Tanggal Kejadian"
              type="date"
              value={form.tanggal_kejadian}
              onChange={(e) => onChange('tanggal_kejadian', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Deskripsi Kejadian</label>
            <textarea
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-32 font-medium"
              value={form.deskripsi}
              onChange={(e) => onChange('deskripsi', e.target.value)}
              placeholder="Jelaskan kondisi singkat..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bencana;
