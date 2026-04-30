const router = require('express').Router();
const c = require('../controllers/bencanaController');
const protect = require('../middleware/auth');

router.get('/aktif', c.getBencanaAktif);                                             // publik
router.get('/', protect(['petugas','admin']), c.getAllBencana);
router.get('/:id', c.getDetailBencana);                                              // publik
router.post('/', protect(['petugas','admin']), c.tambahBencana);
router.put('/:id', protect(['petugas','admin']), c.updateBencana);
router.delete('/:id', protect(['admin']), c.hapusBencana);

module.exports = router;