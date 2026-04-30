const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bencana = require('./Bencana');

const Logistik = sequelize.define('Logistik', {
  id_barang: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bencanaId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Bencana, key: 'id_bencana' } 
  },
  nama_barang: { type: DataTypes.STRING, allowNull: false },
  jenis: { type: DataTypes.ENUM('makanan','obat','pakaian','peralatan','lainnya'), defaultValue: 'lainnya' },
  satuan: { type: DataTypes.STRING, allowNull: false },
  stok: { type: DataTypes.INTEGER, defaultValue: 0 },
  tipe: { type: DataTypes.ENUM('masuk','keluar'), allowNull: false },
  jumlah: { type: DataTypes.INTEGER, allowNull: false },
  poskoId: { type: DataTypes.INTEGER, allowNull: true },
  keterangan: { type: DataTypes.TEXT },
}, { tableName: 'logistik', timestamps: true });

Logistik.belongsTo(Bencana, { foreignKey: 'bencanaId' });
Bencana.hasMany(Logistik, { foreignKey: 'bencanaId' });

module.exports = Logistik;