const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Korban = sequelize.define('Korban', {
  id_korban: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bencanaId: { type: DataTypes.INTEGER, allowNull: false },
  jumlah_meninggal: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_luka: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_pengungsi: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_hilang: { type: DataTypes.INTEGER, defaultValue: 0 },
  keterangan: { type: DataTypes.TEXT },
}, { tableName: 'korban', timestamps: true });

module.exports = Korban;