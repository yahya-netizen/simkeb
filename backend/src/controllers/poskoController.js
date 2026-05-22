const { Posko, Bencana } = require('../models');

exports.getAllPosko = async (req, res) => {
  try {
    const posko = await Posko.findAll({
      include: [{ model: Bencana, attributes: ['nama_bencana', 'lokasi'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posko);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPoskoByBencana = async (req, res) => {
  try {
    const posko = await Posko.findAll({ where: { bencanaId: req.params.bencanaId } });
    res.json(posko);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tambahPosko = async (req, res) => {
  try {
    const posko = await Posko.create(req.body);
    res.status(201).json({ message: 'Posko berhasil ditambahkan', posko });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePosko = async (req, res) => {
  try {
    const posko = await Posko.findByPk(req.params.id);
    if (!posko) return res.status(404).json({ message: 'Posko tidak ditemukan' });
    await posko.update(req.body);
    res.json({ message: 'Data posko diperbarui', posko });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hapusPosko = async (req, res) => {
  try {
    await Posko.destroy({ where: { id_posko: req.params.id } });
    res.json({ message: 'Posko dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};