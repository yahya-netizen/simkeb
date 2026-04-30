const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Petugas = sequelize.define('Petugas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  NIP: { type: DataTypes.STRING, unique: true },
  instansi: { type: DataTypes.STRING },
}, { tableName: 'petugas', timestamps: true });

Petugas.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Petugas, { foreignKey: 'userId' });

module.exports = Petugas;