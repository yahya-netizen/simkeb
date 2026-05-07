const Logistik = require('../models/Logistik');
const Bencana = require('../models/Bencana');
const { Op } = require('sequelize');

exports.getAllLogistik = async (req, res) => {
  try {
    const logistik = await Logistik.findAll({
      include: [{ model: Bencana, attributes: ['nama_bencana'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(logistik);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogistikByBencana = async (req, res) => {
  try {
    const logistik = await Logistik.findAll({
      where: { bencanaId: req.params.bencanaId },
      order: [['createdAt', 'DESC']]
    });
    res.json(logistik);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStokByBencana = async (req, res) => {
  try {
    const sequelize = require('../config/database');
    const stok = await Logistik.findAll({
      where: { bencanaId: req.params.bencanaId },
      attributes: [
        'nama_barang', 'satuan', 'jenis',
        [sequelize.fn('SUM', sequelize.literal(
          "CASE WHEN tipe='masuk' THEN jumlah ELSE -jumlah END"
        )), 'stok_tersedia']
      ],
      group: ['nama_barang', 'satuan', 'jenis'],
    });
    res.json(stok);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tambahLogistik = async (req, res) => {
  try {
    const logistik = await Logistik.create(req.body);
    res.status(201).json({ message: 'Data logistik ditambahkan', logistik });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.distribusiLogistik = async (req, res) => {
  try {
    const { bencanaId, nama_barang, jumlah, poskoId, keterangan, satuan, jenis } = req.body;
    const logistik = await Logistik.create({
      bencanaId, nama_barang, jumlah,
      tipe: 'keluar', poskoId,
      keterangan, satuan, jenis
    });
    res.status(201).json({ message: 'Distribusi logistik berhasil dicatat', logistik });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};