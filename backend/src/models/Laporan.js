const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Laporan = sequelize.define('Laporan', {
  id_laporan: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_pelapor: { type: DataTypes.STRING, allowNull: false },
  jenis: { type: DataTypes.STRING, allowNull: false },
  lokasi: { type: DataTypes.STRING, allowNull: false },
  koordinat: { type: DataTypes.STRING },
  tingkat_keparahan: { type: DataTypes.ENUM('ringan','sedang','berat'), defaultValue: 'ringan' },
  foto: { type: DataTypes.STRING },
  deskripsi: { type: DataTypes.TEXT },
  status: { 
    type: DataTypes.ENUM('dilaporkan','terverifikasi','ditolak','selesai'), 
    defaultValue: 'dilaporkan' 
  },
  alasan_tolak: { type: DataTypes.TEXT },
  petugasId: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { model: User, key: 'id' } 
  },
}, { tableName: 'laporan', timestamps: true });

Laporan.belongsTo(User, { foreignKey: 'petugasId', as: 'petugas' });

module.exports = Laporan;