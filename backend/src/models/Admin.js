const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  login_terakhir: { type: DataTypes.DATE },
}, { tableName: 'admins', timestamps: true });

module.exports = Admin;