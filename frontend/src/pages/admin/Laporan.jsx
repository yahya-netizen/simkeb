import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, CheckCircle2, XCircle, Clock, Search, AlertCircle, RefreshCcw } from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Button from '../../component/ui/Button';
import Modal from '../../component/ui/Modal';
import { formatDate } from '../../utils/format';

const statusOptions = ['menunggu', 'terverifikasi', 'selesai', 'ditolak'];

const Laporan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [statusFilter, setStatusFilter] = useState('');
  const [isVerifOpen, setIsVerifOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [verifStatus, setVerifStatus] = useState('terverifikasi');
  const [alasanTolak, setAlasanTolak] = useState('');

  const canVerify = useMemo(() => {
    return user?.role === 'petugas' || user?.role === 'admin';
  }, [user?.role]);

  const { data: laporan, isLoading, refetch } = useQuery({
    queryKey: ['laporan', statusFilter || 'all'],
    queryFn: async () => {
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res = await api.get(`/laporan${qs}`);
      return res.data;
    },
  });

  const openVerif = (row) => {
    setSelectedId(row.id_laporan);
    setVerifStatus(row.status || 'terverifikasi');
    setAlasanTolak('');
    setIsVerifOpen(true);
  };

  const closeVerif = () => {
    setIsVerifOpen(false);
    setSelectedId(null);
    setAlasanTolak('');
  };

  const handleSubmitVerif = async () => {
    if (!selectedId) return;

    const payload = {
      status: verifStatus,
      alasan_tolak: verifStatus === 'ditolak' ? alasanTolak : undefined,
    };

    try {
      await api.put(`/laporan/${selectedId}/verifikasi`, payload);
      await queryClient.invalidateQueries({ queryKey: ['laporan'] });
      closeVerif();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'terverifikasi':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider"><CheckCircle2 size={12}/> Terverifikasi</span>;
      case 'selesai':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider"><CheckCircle2 size={12}/> Selesai</span>;
      case 'ditolak':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider"><XCircle size={12}/> Ditolak</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider"><Clock size={12}/> Menunggu</span>;
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
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Laporan</h1>
          <p className="text-slate-500 font-medium mt-1">Verifikasi dan kelola laporan bencana dari masyarakat.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="h-11 pl-4 pr-10 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <Table headers={['Pelapor', 'Jenis & Tingkat', 'Lokasi', 'Tanggal', 'Status', 'Aksi']}>
          {(laporan || []).length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-20 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <FileText size={48} className="text-slate-200" />
                  </div>
                  <p className="text-lg font-bold text-slate-500">Tidak ada laporan</p>
                  <p className="text-sm">Belum ada data laporan yang tersedia saat ini.</p>
                </div>
              </td>
            </tr>
          ) : (
            laporan.map((row) => (
              <tr key={row.id_laporan} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{row.nama_pelapor}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">#{row.id_laporan}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{row.jenis}</div>
                  <div className="text-[10px] font-bold text-orange-600 mt-0.5 uppercase tracking-wider">{row.tingkat_keparahan}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-600 line-clamp-1 max-w-xs">{row.lokasi}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-500">
                  {formatDate(row.createdAt)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(row.status)}
                </td>
                <td className="px-6 py-4">
                  {canVerify ? (
                    <Button size="sm" variant="ghost" onClick={() => openVerif(row)} className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                      <AlertCircle size={14} className="mr-1.5" /> Tinjau
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">No Action</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </Table>
      </Card>

      <Modal
        isOpen={isVerifOpen}
        onClose={closeVerif}
        title="Verifikasi Laporan"
        footer={
          <>
            <Button variant="outline" onClick={closeVerif}>Batal</Button>
            <Button onClick={handleSubmitVerif} disabled={verifStatus === 'ditolak' && !alasanTolak.trim()}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Ubah Status Laporan</label>
            <select
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              value={verifStatus}
              onChange={(e) => setVerifStatus(e.target.value)}
            >
              <option value="terverifikasi">✅ Terverifikasi</option>
              <option value="selesai">🎯 Selesai</option>
              <option value="ditolak">❌ Ditolak</option>
              <option value="menunggu">⏳ Menunggu</option>
            </select>
          </div>

          {verifStatus === 'ditolak' && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-sm font-bold text-slate-700">Alasan Penolakan <span className="text-red-500">*</span></label>
              <textarea
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                placeholder="Tuliskan alasan laporan ini ditolak..."
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none h-28 font-medium"
                required
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Laporan;
