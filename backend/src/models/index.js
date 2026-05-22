/**
 * models/index.js — Titik pusat untuk memuat semua model dan mendefinisikan relasi.
 * 
 * Dengan menyentralisasi semua asosiasi di sini, kita menghindari:
 * 1. Circular dependency antar file model
 * 2. Ketergantungan pada urutan require()
 * 3. Risiko SequelizeEagerLoadingError
 */

const sequelize = require('../config/database');

// ──── Load semua model ────
const User = require('./User');
const Admin = require('./Admin');
const Petugas = require('./Petugas');
const Relawan = require('./Relawan');
const Masyarakat = require('./Masyarakat');
const Bencana = require('./Bencana');
const Korban = require('./Korban');
const Posko = require('./Posko');
const Logistik = require('./Logistik');
const Laporan = require('./Laporan');
const PenugasanRelawan = require('./PenugasanRelawan');

// ──── Definisi Asosiasi ────

// User <-> Admin (1:1)
Admin.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Admin, { foreignKey: 'userId' });

// User <-> Petugas (1:1)
Petugas.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Petugas, { foreignKey: 'userId' });

// User <-> Relawan (1:1)
Relawan.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Relawan, { foreignKey: 'userId' });

// User <-> Masyarakat (1:1)
Masyarakat.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Masyarakat, { foreignKey: 'userId' });

// Laporan -> User (petugas verifikator)
Laporan.belongsTo(User, { foreignKey: 'petugasId', as: 'petugas' });

// Bencana <-> Korban (1:N)
Korban.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Korban, { foreignKey: 'bencanaId' });

// Bencana <-> Posko (1:N)
Posko.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Posko, { foreignKey: 'bencanaId' });

// Bencana <-> Logistik (1:N)
Logistik.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Logistik, { foreignKey: 'bencanaId' });

// Bencana <-> PenugasanRelawan (1:N)
PenugasanRelawan.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(PenugasanRelawan, { foreignKey: 'bencanaId' });

// Relawan <-> PenugasanRelawan (1:N)
PenugasanRelawan.belongsTo(Relawan, { foreignKey: 'relawanId' });
Relawan.hasMany(PenugasanRelawan, { foreignKey: 'relawanId' });

// ──── Export ────
module.exports = {
  sequelize,
  User,
  Admin,
  Petugas,
  Relawan,
  Masyarakat,
  Bencana,
  Korban,
  Posko,
  Logistik,
  Laporan,
  PenugasanRelawan,
};
