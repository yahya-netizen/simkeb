import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../component/ui/Button';
import Input from '../../component/ui/Input';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Modal from '../../component/ui/Modal';

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
    const rowId = row.id_bencana ?? row.id ?? row._id ?? row.bencanaId ?? row.idBencana ?? null;
    setSelectedId(rowId);

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
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rowId) => {
    const ok = window.confirm('Hapus data bencana ini?');
    if (!ok) return;

    try {
      await api.delete(`/bencana/${rowId}`);
      await refetch();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const formatRowId = (row) => row.id_bencana ?? row.id ?? row._id ?? row.bencanaId ?? row.idBencana;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Bencana</h1>
          <p className="text-slate-500">Kelola data kejadian bencana (admin/petugas).</p>
        </div>
        <Button onClick={openCreate} className="bg-primary-500 hover:bg-primary-600">
          Tambah Bencana
        </Button>
      </div>

      <Card>
        <Table headers={['ID', 'Nama', 'Jenis', 'Tingkat', 'Lokasi', 'Tanggal Kejadian', 'Aksi']}>
          {(bencanaList || []).map((row) => {
            const rowId = formatRowId(row);

            return (
              <tr key={rowId} className="text-slate-700">
                <td className="px-6 py-3">{rowId}</td>
                <td className="px-6 py-3 font-medium text-slate-900">{row.nama_bencana}</td>
                <td className="px-6 py-3">{row.jenis}</td>
                <td className="px-6 py-3">{row.tingkat_parah}</td>
                <td className="px-6 py-3">{row.lokasi}</td>
                <td className="px-6 py-3">
                  {row.tanggal_kejadian ? String(row.tanggal_kejadian).slice(0, 10) : '-'}
                </td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/bencana/${rowId}`)}>
                      Detail
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(rowId)}
                    >
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={mode === 'create' ? 'Tambah Bencana' : 'Edit Bencana'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama Bencana"
            value={form.nama_bencana}
            onChange={(e) => onChange('nama_bencana', e.target.value)}
            placeholder="Contoh: Gempa Bumi"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Bencana</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={form.jenis}
              onChange={(e) => onChange('jenis', e.target.value)}
            >
              {jenisOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tingkat Keparahan</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={form.tingkat_parah}
              onChange={(e) => onChange('tingkat_parah', e.target.value)}
            >
              {tingkatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Lokasi"
            value={form.lokasi}
            onChange={(e) => onChange('lokasi', e.target.value)}
            placeholder="Contoh: Kabupaten X"
          />

          <Input
            label="Koordinat (opsional)"
            value={form.koordinat}
            onChange={(e) => onChange('koordinat', e.target.value)}
            placeholder="Contoh: -7.123, 112.456"
          />

          <Input
            label="Tanggal Kejadian"
            type="date"
            value={form.tanggal_kejadian}
            onChange={(e) => onChange('tanggal_kejadian', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={form.deskripsi}
              onChange={(e) => onChange('deskripsi', e.target.value)}
              placeholder="Jelaskan kondisi/kejadian singkat..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bencana;
