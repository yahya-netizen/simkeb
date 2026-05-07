import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, CheckCircle2, XCircle, Clock, Search, AlertCircle } from 'lucide-react';
import api from '../../services/api';

import useAuthStore from '../../store/useAuthStore';

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

  const laporanQueryKey = useMemo(
    () => ['laporan', statusFilter || 'all'],
    [statusFilter]
  );

  const { data: laporan, isLoading, refetch } = useQuery({
    queryKey: laporanQueryKey,
    queryFn: async () => {
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res = await api.get(`/laporan${qs}`);
      return res.data;
    },
  });

  const openVerif = (row) => {
    setSelectedId(row.id ?? row.id_laporan ?? row._id ?? row.laporanId ?? null);
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

    await api.put(`/laporan/${selectedId}/verifikasi`, payload);
    await queryClient.invalidateQueries({ queryKey: ['laporan'] });
    await refetch();
    closeVerif();
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'terverifikasi':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider"><CheckCircle2 size={12}/> Terverifikasi</span>;
      case 'selesai':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider"><CheckCircle2 size={12}/> Selesai</span>;
      case 'ditolak':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider"><XCircle size={12}/> Ditolak</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider"><Clock size={12}/> Menunggu</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-16 bg-slate-200 rounded-2xl" />
        <div className="h-[500px] bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Laporan</h1>
          <p className="text-slate-500 font-medium mt-1">Verifikasi dan kelola laporan bencana dari masyarakat.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="h-10 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50"
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
          </div>
          <button 
            onClick={() => refetch()} 
            className="h-10 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-700 text-xs tracking-wider uppercase">Nama Pelapor</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-xs tracking-wider uppercase">Jenis & Tingkat</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-xs tracking-wider uppercase">Lokasi</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-xs tracking-wider uppercase">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-xs tracking-wider uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(laporan || []).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText size={48} className="mb-4 text-slate-300" />
                      <p className="text-lg font-bold text-slate-500">Tidak ada laporan</p>
                      <p className="text-sm">Belum ada data laporan yang sesuai dengan filter saat ini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                laporan.map((row) => {
                  const rowId = row.id ?? row.id_laporan ?? row._id ?? row.laporanId;
                  return (
                    <tr key={rowId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{row.nama_pelapor}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">ID: {rowId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{row.jenis}</div>
                        <div className="text-xs font-semibold text-orange-600 mt-0.5 capitalize">{row.tingkat_keparahan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-600 line-clamp-2 max-w-xs">{row.lokasi}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {canVerify ? (
                          <button 
                            onClick={() => openVerif(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-xs rounded-lg transition-colors border border-primary-100"
                          >
                            <AlertCircle size={14} /> Tinjau
                          </button>
                        ) : (
                          <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 font-bold text-xs rounded-lg border border-slate-100 cursor-not-allowed">
                            <FileText size={14} /> Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isVerifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">Verifikasi Laporan</h3>
              <button onClick={closeVerif} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Ubah Status Laporan</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
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
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none h-24 font-medium"
                    required
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={closeVerif}
                className="px-4 py-2 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmitVerif}
                disabled={verifStatus === 'ditolak' && !alasanTolak.trim()}
                className="px-6 py-2 font-bold text-white bg-primary-600 border border-transparent rounded-xl hover:bg-primary-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(234,88,12,0.3)]"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;
