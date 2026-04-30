const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bencana = require('./Bencana');

const Posko = sequelize.define('Posko', {
  id_posko: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bencanaId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Bencana, key: 'id_bencana' } 
  },
  nama_posko: { type: DataTypes.STRING, allowNull: false },
  lokasi: { type: DataTypes.STRING, allowNull: false },
  koordinat: { type: DataTypes.STRING },
  kapasitas: { type: DataTypes.INTEGER, defaultValue: 0 },
  jumlah_pengungsi: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('aktif','penuh','tutup'), defaultValue: 'aktif' },
}, { tableName: 'posko', timestamps: true });

Posko.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Posko, { foreignKey: 'bencanaId' });

module.exports = Posko;