const router = require('express').Router();
const c = require('../controllers/relawanController');
const protect = require('../middleware/auth');

router.get('/', protect(['petugas','admin']), c.getAllRelawan);
router.post('/daftar', c.daftarRelawan);                                             // publik
router.put('/:id/verifikasi', protect(['admin','petugas']), c.verifikasiRelawan);
router.get('/:relawanId/penugasan', protect(['relawan','petugas','admin']), c.getPenugasan);
router.post('/tugaskan', protect(['petugas','admin']), c.tugaskanRelawan);
router.put('/penugasan/:id/status', protect(['relawan','petugas','admin']), c.updateStatusPenugasan);

module.exports = router;