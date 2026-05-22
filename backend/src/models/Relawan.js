const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Relawan = sequelize.define('Relawan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  no_identitas: { type: DataTypes.STRING, unique: true },
  keahlian: { type: DataTypes.ENUM('rescue/p3k', 'tim dapur', 'tim logistik', 'psikolog', 'penghibur anak2', 'lainnya'), defaultValue: 'rescue/p3k' },
  keahlian_lainnya: { type: DataTypes.STRING, allowNull: true },
  status_ketersediaan: { type: DataTypes.ENUM('standby','bertugas','selesai'), defaultValue: 'standby' },
  status_aktif: { type: DataTypes.BOOLEAN, defaultValue: false },
  tgl_daftar: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'relawan', timestamps: true });

module.exports = Relawan;