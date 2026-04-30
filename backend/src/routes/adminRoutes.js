const router = require('express').Router();
const c = require('../controllers/adminController');
const protect = require('../middleware/auth');

router.get('/users', protect(['admin']), c.getAllUsers);
router.put('/users/:id', protect(['admin']), c.updateUser);
router.put('/users/:id/reset-password', protect(['admin']), c.resetPassword);
router.delete('/users/:id', protect(['admin']), c.hapusUser);

module.exports = router;