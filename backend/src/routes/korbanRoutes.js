const router = require('express').Router();
const c = require('../controllers/korbanController');
const protect = require('../middleware/auth');

router.get('/bencana/:bencanaId', protect(['petugas','admin']), c.getKorbanByBencana);
router.post('/bencana/:bencanaId', protect(['petugas','admin']), c.tambahKorban);
router.put('/:id', protect(['petugas','admin']), c.updateKorban);

module.exports = router;