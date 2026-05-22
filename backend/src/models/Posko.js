const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Posko = sequelize.define('Posko', {
  id_posko: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bencanaId: { type: DataTypes.INTEGER, allowNull: false },
  nama_posko: { type: DataTypes.STRING, allowNull: false },
  lokasi: { type: DataTypes.STRING, allowNull: false },
  koordinat: { type: DataTypes.STRING },
  kapasitas: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_pengungsi: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('aktif','penuh','tutup'), defaultValue: 'aktif' },
}, { tableName: 'posko', timestamps: true });

module.exports = Posko;