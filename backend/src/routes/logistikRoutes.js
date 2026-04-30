const router = require('express').Router();
const c = require('../controllers/logistikController');
const protect = require('../middleware/auth');

router.get('/bencana/:bencanaId', protect(['petugas','admin']), c.getLogistikByBencana);
router.get('/stok/:bencanaId', protect(['petugas','admin']), c.getStokByBencana);
router.post('/', protect(['petugas','admin']), c.tambahLogistik);
router.post('/distribusi', protect(['petugas','admin']), c.distribusiLogistik);

module.exports = router;