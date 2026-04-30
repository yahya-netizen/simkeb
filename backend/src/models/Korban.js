const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bencana = require('./Bencana');

const Korban = sequelize.define('Korban', {
  id_korban: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bencanaId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Bencana, key: 'id_bencana' } 
  },
  jumlah_meninggal: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_luka: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_pengungsi: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_hilang: { type: DataTypes.INTEGER, defaultValue: 0 },
  keterangan: { type: DataTypes.TEXT },
}, { tableName: 'korban', timestamps: true });

Korban.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Korban, { foreignKey: 'bencanaId' });

module.exports = Korban;