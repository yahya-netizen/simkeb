import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Card from '../../component/ui/Card';
import Table from '../../component/ui/Table';
import Button from '../../component/ui/Button';
import Modal from '../../component/ui/Modal';
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

  const { data: relawanList, refetch: refetchRelawan } = useQuery({
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
      // Backend route: GET /relawan/:relawanId/penugasan
      // Kita asumsikan user.id (dari token) = relawanId saat role relawan.
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
    const relId = row.id ?? row.relawanId ?? row._id ?? null;
    setSelectedRelawanId(relId);
    setVerifStatus(Boolean(row.status_aktif));
    setIsVerifOpen(true);
  };

  const handleSubmitVerif = async () => {
    if (!selectedRelawanId) return;
    await api.put(`/relawan/${selectedRelawanId}/verifikasi`, { status_aktif: verifStatus });
    setIsVerifOpen(false);
    setSelectedRelawanId(null);
    await refetchRelawan();
    await queryClient.invalidateQueries({ queryKey: ['relawan-penugasan'] });
  };

  const handleSubmitAssign = async () => {
    if (!selectedRelawanId) return;
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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Relawan</h1>
          <p className="text-slate-500">
            {isRelawanRole ? 'Lihat penugasan Anda' : 'Verifikasi & penugasan relawan'}
          </p>
        </div>
        {canVerify && !isRelawanRole && (
          <Button variant="outline" onClick={() => refetchRelawan()} className="bg-white">
            Refresh
          </Button>
        )}
      </div>

      {!isRelawanRole && canVerify && (
        <Card>
          <Table headers={['ID Relawan', 'Nama', 'No HP', 'Keahlian', 'Status', 'Aksi']}>
            {(relawanList || []).map((row) => {
              const relId = row.id ?? row.relawanId ?? row._id ?? null;
              return (
                <tr key={relId} className="text-slate-700">
                  <td className="px-6 py-3">{relId ?? '-'}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {row.User?.nama_lengkap || row.nama_lengkap || '-'}
                  </td>
                  <td className="px-6 py-3">{row.User?.no_hp || row.no_hp || '-'}</td>
                  <td className="px-6 py-3 capitalize">
                    {row.keahlian === 'lainnya' ? row.keahlian_lainnya : row.keahlian || '-'}
                  </td>
                  <td className="px-6 py-3">
                    {row.status_aktif ? 'aktif' : 'menunggu'}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => handleOpenVerif(row)}>
                        Verifikasi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRelawanId(relId);
                          setIsAssignOpen(true);
                          setAssignBencanaId('');
                          setAssignCatatan('');
                        }}
                      >
                        Tugaskan
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
        <Card title="Penugasan Anda">
          {loadingMyPenugasan ? (
            <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ) : (
            <Table headers={['Bencana', 'Catatan', 'Status']}>
              {(myPenugasan || []).map((p) => (
                <tr key={p.id} className="text-slate-700">
                  <td className="px-6 py-3">{p.Bencana?.nama_bencana || '-'}</td>
                  <td className="px-6 py-3">{p.catatan || '-'}</td>
                  <td className="px-6 py-3">{p.status || '-'}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      {!isRelawanRole && canVerify && selectedRelawanId && (
        <Card title="Penugasan Relawan (Detail)">
          {loadingPenugasan ? (
            <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ) : (
            <Table headers={['Bencana', 'Catatan', 'Status']}>
              {(penugasanList || []).map((p) => (
                <tr key={p.id} className="text-slate-700">
                  <td className="px-6 py-3">{p.Bencana?.nama_bencana || '-'}</td>
                  <td className="px-6 py-3">{p.catatan || '-'}</td>
                  <td className="px-6 py-3">{p.status || '-'}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      )}

      <Modal
        isOpen={isVerifOpen}
        onClose={() => setIsVerifOpen(false)}
        title="Verifikasi Relawan"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsVerifOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitVerif} className="bg-primary-500 hover:bg-primary-600">
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status Akun</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={verifStatus ? 'aktif' : 'nonaktif'}
              onChange={(e) => setVerifStatus(e.target.value === 'aktif')}
            >
              <option value="aktif">aktif</option>
              <option value="nonaktif">nonaktif</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Tugaskan Relawan"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitAssign} className="bg-primary-500 hover:bg-primary-600">
              Tugaskan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Bencana</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={assignBencanaId}
              onChange={(e) => setAssignBencanaId(e.target.value)}
            >
              <option value="">-- pilih --</option>
              {(bencanaOptions || []).map((b) => {
                const bId = b.id_bencana ?? b.id ?? b.bencanaId ?? null;
                return (
                  <option key={bId} value={bId}>
                    {b.nama_bencana}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Detail Tugas Khusus</label>
            <input
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              value={assignCatatan}
              onChange={(e) => setAssignCatatan(e.target.value)}
              placeholder="misal: standby medis, jam 08.00 - 17.00"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Relawan;
