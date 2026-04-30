const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Masyarakat = sequelize.define('Masyarakat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  no_identitas: { type: DataTypes.STRING },
  tgl_daftar: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'masyarakat', timestamps: true });

Masyarakat.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Masyarakat, { foreignKey: 'userId' });

module.exports = Masyarakat;