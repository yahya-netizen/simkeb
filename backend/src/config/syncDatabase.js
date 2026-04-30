const sequelize = require('./database');
require('../models/User');
require('../models/Admin');
require('../models/Petugas');
require('../models/Relawan');
require('../models/Masyarakat');
require('../models/Laporan');
require('../models/Bencana');
require('../models/Korban');
require('../models/Posko');
require('../models/Logistik');
require('../models/PenugasanRelawan');

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database terhubung');
    await sequelize.sync({ alter: true }); // alter:true aman untuk development
    console.log('Semua tabel berhasil disinkronisasi');
  } catch (err) {
    console.error('Gagal sinkronisasi database:', err);
  }
};

module.exports = syncDB;