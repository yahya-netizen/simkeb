const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Masyarakat = sequelize.define('Masyarakat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  no_identitas: { type: DataTypes.STRING },
  tgl_daftar: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'masyarakat', timestamps: true });

module.exports = Masyarakat;