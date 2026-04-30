const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  login_terakhir: { type: DataTypes.DATE },
}, { tableName: 'admins', timestamps: true });

Admin.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Admin, { foreignKey: 'userId' });

module.exports = Admin;