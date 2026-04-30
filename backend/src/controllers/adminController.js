const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nama_lengkap, no_hp, role } = req.body;
    await User.update({ nama_lengkap, no_hp, role }, { where: { id: req.params.id } });
    res.json({ message: 'Data user diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password_baru } = req.body;
    const hashed = await bcrypt.hash(password_baru, 10);
    await User.update({ password: hashed }, { where: { id: req.params.id } });
    res.json({ message: 'Password berhasil direset' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hapusUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};