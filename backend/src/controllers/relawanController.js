const { Relawan, User, PenugasanRelawan, Bencana } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllRelawan = async (req, res) => {
  try {
    const relawan = await Relawan.findAll({
      include: [{ model: User, attributes: ['nama_lengkap', 'no_hp'] }],
    });
    res.json(relawan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.daftarRelawan = async (req, res) => {
  try {
    const { username, password, nama_lengkap, no_hp, no_identitas, keahlian, keahlian_lainnya } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username sudah digunakan' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, nama_lengkap, no_hp, role: 'relawan' });
    const relawan = await Relawan.create({ userId: user.id, no_identitas, keahlian, keahlian_lainnya: keahlian === 'lainnya' ? keahlian_lainnya : null });

    res.status(201).json({ message: 'Pendaftaran relawan berhasil, menunggu verifikasi', relawanId: relawan.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifikasiRelawan = async (req, res) => {
  try {
    const { status_aktif } = req.body;
    const relawan = await Relawan.findByPk(req.params.id);
    if (!relawan) return res.status(404).json({ message: 'Relawan tidak ditemukan' });
    await relawan.update({ status_aktif });
    res.json({ message: status_aktif ? 'Akun relawan diaktifkan' : 'Pendaftaran ditolak', relawan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPenugasan = async (req, res) => {
  try {
    const penugasan = await PenugasanRelawan.findAll({
      where: { relawanId: req.params.relawanId },
      include: [{ model: Bencana }]
    });
    res.json(penugasan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tugaskanRelawan = async (req, res) => {
  try {
    const { relawanId, bencanaId, catatan } = req.body;
    const penugasan = await PenugasanRelawan.create({ relawanId, bencanaId, catatan });
    await Relawan.update({ status_ketersediaan: 'bertugas' }, { where: { id: relawanId } });
    res.status(201).json({ message: 'Relawan berhasil ditugaskan', penugasan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatusPenugasan = async (req, res) => {
  try {
    const { status } = req.body;
    const penugasan = await PenugasanRelawan.findByPk(req.params.id);
    if (!penugasan) return res.status(404).json({ message: 'Penugasan tidak ditemukan' });
    await penugasan.update({ status });
    if (status === 'selesai') {
      await Relawan.update({ status_ketersediaan: 'standby' }, { where: { id: penugasan.relawanId } });
    }
    res.json({ message: 'Status penugasan diperbarui', penugasan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};