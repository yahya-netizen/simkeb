const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bencana = sequelize.define('Bencana', {
  id_bencana: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_bencana: { type: DataTypes.STRING, allowNull: false },
  jenis: { type: DataTypes.STRING, allowNull: false },
  tingkat_parah: { type: DataTypes.ENUM('ringan','sedang','berat','kritis'), defaultValue: 'sedang' },
  lokasi: { type: DataTypes.STRING, allowNull: false },
  koordinat: { type: DataTypes.STRING },
  deskripsi: { type: DataTypes.TEXT },
  tanggal_kejadian: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('aktif','ditangani','selesai'), defaultValue: 'aktif' },
}, { tableName: 'bencana', timestamps: true });

module.exports = Bencana;