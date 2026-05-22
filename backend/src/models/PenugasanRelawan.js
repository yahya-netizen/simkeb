const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PenugasanRelawan = sequelize.define('PenugasanRelawan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  relawanId: { type: DataTypes.INTEGER, allowNull: false },
  bencanaId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('standby','bertugas','selesai'), defaultValue: 'standby' },
  tgl_penugasan: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  catatan: { type: DataTypes.TEXT },
}, { tableName: 'penugasan_relawan', timestamps: true });

module.exports = PenugasanRelawan;