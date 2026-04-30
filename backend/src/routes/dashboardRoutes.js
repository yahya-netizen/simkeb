const router = require('express').Router();
const c = require('../controllers/dashboardController');
const protect = require('../middleware/auth');

router.get('/ringkasan', protect(['petugas','admin']), c.getRingkasan);
router.get('/laporan-terbaru', protect(['petugas','admin']), c.getLaporanTerbaru);

module.exports = router;