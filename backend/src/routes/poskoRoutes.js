const router = require('express').Router();
const c = require('../controllers/poskoController');
const protect = require('../middleware/auth');

router.get('/', c.getAllPosko);                                                       // publik
router.get('/bencana/:bencanaId', c.getPoskoByBencana);
router.post('/', protect(['petugas','admin']), c.tambahPosko);
router.put('/:id', protect(['petugas','admin']), c.updatePosko);
router.delete('/:id', protect(['admin']), c.hapusPosko);

module.exports = router;