const sequelize = require('./database');

// Memuat semua model dan relasinya dari satu titik pusat
require('../models');

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