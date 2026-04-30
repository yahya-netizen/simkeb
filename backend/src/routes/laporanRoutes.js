const router = require('express').Router();
const c = require('../controllers/laporanController');
const protect = require('../middleware/auth');

router.post('/', c.upload.single('foto'), c.kirimLaporan);                          // publik
router.get('/', protect(['petugas','admin']), c.getDaftarLaporan);
router.get('/:id', protect(['petugas','admin']), c.getDetailLaporan);
router.put('/:id/verifikasi', protect(['petugas','admin']), c.verifikasiLaporan);

module.exports = router;