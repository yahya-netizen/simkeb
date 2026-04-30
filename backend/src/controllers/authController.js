const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Relawan = require('../models/Relawan');
const Petugas = require('../models/Petugas');
const Admin = require('../models/Admin');

exports.register = async (req, res) => {
  try {
    const { username, password, nama_lengkap, no_hp, role, 
            no_identitas, keahlian, NIP, instansi, email } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username sudah digunakan' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, nama_lengkap, no_hp, role });

    if (role === 'relawan') {
      await Relawan.create({ userId: user.id, no_identitas, keahlian });
    } else if (role === 'petugas') {
      await Petugas.create({ userId: user.id, NIP, instansi });
    } else if (role === 'admin') {
      await Admin.create({ userId: user.id, email });
    }

    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, role: user.role, nama: user.nama_lengkap },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, user: { id: user.id, nama: user.nama_lengkap, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });
  res.json(user);
};