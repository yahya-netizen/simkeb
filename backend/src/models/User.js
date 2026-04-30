const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nama_lengkap: { type: DataTypes.STRING, allowNull: false },
  no_hp: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('admin','petugas','relawan','masyarakat'), allowNull: false },
}, { tableName: 'users', timestamps: true });

module.exports = User;