const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Petugas = sequelize.define('Petugas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  NIP: { type: DataTypes.STRING, unique: true },
  instansi: { type: DataTypes.STRING },
}, { tableName: 'petugas', timestamps: true });

module.exports = Petugas;