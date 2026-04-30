const Bencana = require('../models/Bencana');
const Korban = require('../models/Korban');
const Posko = require('../models/Posko');
const Relawan = require('../models/Relawan');
const Laporan = require('../models/Laporan');
const sequelize = require('../config/database');

exports.getRingkasan = async (req, res) => {
  try {
    const [
      totalBencanaAktif,
      totalPosko,
      totalRelawanAktif,
      totalLaporanMasuk,
      korbanStats
    ] = await Promise.all([
      Bencana.count({ where: { status: 'aktif' } }),
      Posko.count({ where: { status: 'aktif' } }),
      Relawan.count({ where: { status_ketersediaan: 'bertugas' } }),
      Laporan.count({ where: { status: 'dilaporkan' } }),
      Korban.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('jumlah_pengungsi')), 'total_pengungsi'],
          [sequelize.fn('SUM', sequelize.col('jumlah_meninggal')), 'total_meninggal'],
          [sequelize.fn('SUM', sequelize.col('jumlah_luka')), 'total_luka'],
        ]
      })
    ]);

    res.json({
      total_bencana_aktif: totalBencanaAktif,
      total_posko: totalPosko,
      total_relawan_aktif: totalRelawanAktif,
      total_laporan_masuk: totalLaporanMasuk,
      total_pengungsi: korbanStats?.dataValues.total_pengungsi || 0,
      total_meninggal: korbanStats?.dataValues.total_meninggal || 0,
      total_luka: korbanStats?.dataValues.total_luka || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLaporanTerbaru = async (req, res) => {
  try {
    const laporan = await Laporan.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};