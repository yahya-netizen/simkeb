const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Relawan = require('./Relawan');
const Bencana = require('./Bencana');

const PenugasanRelawan = sequelize.define('PenugasanRelawan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  relawanId: { type: DataTypes.INTEGER, references: { model: Relawan, key: 'id' } },
  bencanaId: { type: DataTypes.INTEGER, references: { model: Bencana, key: 'id_bencana' } },
  status: { type: DataTypes.ENUM('standby','bertugas','selesai'), defaultValue: 'standby' },
  tgl_penugasan: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  catatan: { type: DataTypes.TEXT },
}, { tableName: 'penugasan_relawan', timestamps: true });

PenugasanRelawan.belongsTo(Relawan, { foreignKey: 'relawanId' });
PenugasanRelawan.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Relawan.hasMany(PenugasanRelawan, { foreignKey: 'relawanId' });
Bencana.hasMany(PenugasanRelawan, { foreignKey: 'bencanaId' });

module.exports = PenugasanRelawan;