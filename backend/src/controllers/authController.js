const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Relawan, Petugas, Admin } = require('../models');

// Role yang valid untuk registrasi
const VALID_ROLES = ['admin', 'petugas', 'relawan', 'masyarakat'];

exports.register = async (req, res) => {
  try {
    const { username, password, nama_lengkap, no_hp, role, 
            no_identitas, keahlian, NIP, instansi, email } = req.body;

    // ── Validasi input wajib ──
    if (!username || !password || !nama_lengkap) {
      return res.status(400).json({ message: 'Username, password, dan nama lengkap wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: `Role tidak valid. Pilihan: ${VALID_ROLES.join(', ')}` });
    }

    // ── Validasi field spesifik per role ──
    if (role === 'relawan' && !no_identitas) {
      return res.status(400).json({ message: 'No identitas wajib diisi untuk relawan' });
    }
    if (role === 'petugas' && !NIP) {
      return res.status(400).json({ message: 'NIP wajib diisi untuk petugas' });
    }
    if (role === 'admin' && !email) {
      return res.status(400).json({ message: 'Email wajib diisi untuk admin' });
    }

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

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = await User.findOne({ 
      where: { username },
      include: [
        { model: Relawan, required: false },
        { model: Petugas, required: false },
        { model: Admin, required: false },
      ]
    });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign(
      { id: user.id, role: user.role, nama: user.nama_lengkap },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Bangun objek profil berdasarkan role
    const profile = {};
    if (user.role === 'relawan' && user.Relawan) {
      profile.relawanId = user.Relawan.id;
      profile.keahlian = user.Relawan.keahlian;
      profile.status_aktif = user.Relawan.status_aktif;
      profile.status_ketersediaan = user.Relawan.status_ketersediaan;
    } else if (user.role === 'petugas' && user.Petugas) {
      profile.petugasId = user.Petugas.id;
      profile.NIP = user.Petugas.NIP;
      profile.instansi = user.Petugas.instansi;
    } else if (user.role === 'admin' && user.Admin) {
      profile.adminId = user.Admin.id;
      profile.email = user.Admin.email;
    }

    res.json({ 
      token, 
      user: { id: user.id, nama: user.nama_lengkap, role: user.role, no_hp: user.no_hp, ...profile } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Relawan, required: false },
        { model: Petugas, required: false },
        { model: Admin, required: false },
      ]
    });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};