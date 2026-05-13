import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, CheckCircle, Clock, MapPin, Plus, RefreshCcw, UserCheck, Briefcase } from 'lucide-react';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Button from '../../component/ui/Button';
import Modal from '../../component/ui/Modal';
import Input from '../../component/ui/Input';
import useAuthStore from '../../store/useAuthStore';

const Relawan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [selectedRelawanId, setSelectedRelawanId] = useState(null);
  const [isVerifOpen, setIsVerifOpen] = useState(false);
  const [verifStatus, setVerifStatus] = useState(true);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignBencanaId, setAssignBencanaId] = useState('');
  const [assignCatatan, setAssignCatatan] = useState('');

  const canVerify = useMemo(() => user?.role === 'admin' || user?.role === 'petugas', [user?.role]);
  const isRelawanRole = user?.role === 'relawan';

  const { data: relawanList, refetch: refetchRelawan, isLoading: loadingRelawan } = useQuery({
    queryKey: ['relawan-all'],
    queryFn: async () => {
      const res = await api.get('/relawan');
      return res.data;
    },
    enabled: canVerify && !isRelawanRole,
  });

  const { data: penugasanList, isLoading: loadingPenugasan } = useQuery({
    queryKey: ['relawan-penugasan', selectedRelawanId],
    queryFn: async () => {
      const res = await api.get(`/relawan/${selectedRelawanId}/penugasan`);
      return res.data;
    },
    enabled: !!selectedRelawanId && !isRelawanRole && canVerify,
  });

  const { data: myPenugasan, isLoading: loadingMyPenugasan } = useQuery({
    queryKey: ['relawan-my-penugasan', user?.id],
    queryFn: async () => {
      const relawanId = user?.id;
      if (!relawanId) return [];
      const res = await api.get(`/relawan/${relawanId}/penugasan`);
      return res.data;
    },
    enabled: isRelawanRole && !!user?.id,
  });

  const { data: bencanaOptions } = useQuery({
    queryKey: ['bencana-aktif-for-assign'],
    queryFn: async () => {
      const res = await api.get('/bencana/aktif');
      return res.data;
    },
    enabled: canVerify && !isRelawanRole,
  });

  const handleOpenVerif = (row) => {
    setSelectedRelawanId(row.id_relawan || row.id);
    setVerifStatus(Boolean(row.status_aktif));
    setIsVerifOpen(true);
  };

  const handleSubmitVerif = async () => {
    if (!selectedRelawanId) return;
    try {
      await api.put(`/relawan/${selectedRelawanId}/verifikasi`, { status_aktif: verifStatus });
      setIsVerifOpen(false);
      setSelectedRelawanId(null);
      await refetchRelawan();
      await queryClient.invalidateQueries({ queryKey: ['relawan-penugasan'] });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitAssign = async () => {
    if (!selectedRelawanId) return;
    try {
      await api.post('/relawan/tugaskan', {
        relawanId: selectedRelawanId,
        bencanaId: assignBencanaId,
        catatan: assignCatatan || undefined,
      });
      setIsAssignOpen(false);
      setAssignBencanaId('');
      setAssignCatatan('');
      await queryClient.invalidateQueries({ queryKey: ['relawan-penugasan'] });
      await refetchRelawan();
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingRelawan || loadingMyPenugasan) return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 bg-slate-100 rounded-xl border-2 border-slate-200" />
      <div className="h-[500px] bg-slate-100 rounded-xl border-2 border-slate-200" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Relawan</h1>
          <p className="text-slate-500 font-medium mt-1">
            {isRelawanRole ? 'Pantau riwayat penugasan dan status tugas Anda.' : 'Verifikasi registrasi relawan dan atur penugasan lapangan.'}
          </p>
        </div>
        {!isRelawanRole && (
          <Button variant="outline" onClick={() => refetchRelawan()} className="bg-white">
            <RefreshCcw size={16} className="mr-2" /> Refresh Data
          </Button>
        )}
      </div>

      {!isRelawanRole && canVerify && (
        <Card>
          <Table headers={['Relawan', 'Kontak', 'Keahlian', 'Status', 'Aksi']}>
            {(relawanList || []).map((row) => {
              const relId = row.id_relawan || row.id;
              return (
                <tr key={relId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{row.User?.nama_lengkap || row.nama_lengkap}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">#{relId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.User?.no_hp || row.no_hp}</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      <Briefcase size={12} />
                      {row.keahlian === 'lainnya' ? row.keahlian_lainnya : row.keahlian}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {row.status_aktif ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider"><CheckCircle size={12}/> Aktif</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider"><Clock size={12}/> Menunggu</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenVerif(row)} className="text-primary-600 hover:bg-primary-50">
                        <UserCheck size={14} className="mr-1.5" /> Verif
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setSelectedRelawanId(relId);
                          setIsAssignOpen(true);
                        }}
                      >
                        <Plus size={14} className="mr-1.5" /> Tugaskan
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}

      {isRelawanRole && (
        <Card title="Riwayat Penugasan Saya">
          <Table headers={['Lokasi Bencana', 'Catatan Tugas', 'Status Penugasan']}>
            {(myPenugasan || []).map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{p.Bencana?.nama_bencana}</div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5"><MapPin size={10} /> {p.Bencana?.lokasi}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 italic">"{p.catatan || 'Tidak ada catatan khusus.'}"</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    p.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!myPenugasan || myPenugasan.length === 0) && (
              <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic font-medium bg-slate-50/30">Anda belum memiliki riwayat penugasan.</td></tr>
            )}
          </Table>
        </Card>
      )}

      {!isRelawanRole && canVerify && selectedRelawanId && (
        <Card title={`Detail Penugasan: #${selectedRelawanId}`} className="animate-slide-up">
          {loadingPenugasan ? (
            <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <Table headers={['Bencana', 'Catatan', 'Status']}>
              {(penugasanList || []).map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 font-bold text-slate-900">{p.Bencana?.nama_bencana}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.catatan || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{p.status}</span>
                  </td>
                </tr>
              ))}
              {(!penugasanList || penugasanList.length === 0) && (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400 italic">Belum ada penugasan untuk relawan ini.</td></tr>
              )}
            </Table>
          )}
        </Card>
      )}

      <Modal
        isOpen={isVerifOpen}
        onClose={() => setIsVerifOpen(false)}
        title="Verifikasi Status Relawan"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsVerifOpen(false)}>Batal</Button>
            <Button onClick={handleSubmitVerif}>Simpan Perubahan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Status Keaktifan Akun</label>
            <select
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              value={verifStatus ? 'aktif' : 'nonaktif'}
              onChange={(e) => setVerifStatus(e.target.value === 'aktif')}
            >
              <option value="aktif">✅ AKTIF (Diverifikasi)</option>
              <option value="nonaktif">⏳ MENUNGGU / NONAKTIF</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Tugaskan Relawan ke Lapangan"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Batal</Button>
            <Button onClick={handleSubmitAssign}>Tugaskan Sekarang</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Pilih Kejadian Bencana</label>
            <select
              className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              value={assignBencanaId}
              onChange={(e) => setAssignBencanaId(e.target.value)}
            >
              <option value="">-- Pilih Bencana Aktif --</option>
              {(bencanaOptions || []).map((b) => (
                <option key={b.id_bencana} value={b.id_bencana}>{b.nama_bencana}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Detail Tugas / Instruksi</label>
            <textarea
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-32 font-medium"
              value={assignCatatan}
              onChange={(e) => setAssignCatatan(e.target.value)}
              placeholder="Berikan instruksi spesifik, misal: Standby Medis di Posko Utama..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Relawan;
