const Laporan = require('../models/Laporan');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/laporan/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
exports.upload = multer({ storage });

exports.kirimLaporan = async (req, res) => {
  try {
    const { nama_pelapor, jenis, lokasi, koordinat, tingkat_keparahan, deskripsi } = req.body;
    const foto = req.file?.filename || null;

    const laporan = await Laporan.create({
      nama_pelapor, jenis, lokasi, koordinat,
      tingkat_keparahan, deskripsi, foto
    });

    res.status(201).json({
      message: 'Laporan berhasil dikirim',
      id_laporan: laporan.id_laporan,
      status: laporan.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDaftarLaporan = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const laporan = await Laporan.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDetailLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.findByPk(req.params.id);
    if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifikasiLaporan = async (req, res) => {
  try {
    const { status, alasan_tolak } = req.body;
    const laporan = await Laporan.findByPk(req.params.id);
    if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    await laporan.update({
      status,
      alasan_tolak: status === 'ditolak' ? alasan_tolak : null,
      petugasId: req.user.id
    });

    res.json({ message: 'Status laporan diperbarui', laporan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};