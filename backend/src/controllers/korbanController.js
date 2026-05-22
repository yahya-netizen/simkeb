const { Korban, Bencana } = require('../models');

exports.getKorbanByBencana = async (req, res) => {
  try {
    const korban = await Korban.findAll({
      where: { bencanaId: req.params.bencanaId },
      include: [{ model: Bencana, attributes: ['nama_bencana', 'lokasi'] }]
    });
    res.json(korban);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tambahKorban = async (req, res) => {
  try {
    const korban = await Korban.create({ ...req.body, bencanaId: req.params.bencanaId });
    res.status(201).json({ message: 'Data korban ditambahkan', korban });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateKorban = async (req, res) => {
  try {
    const korban = await Korban.findByPk(req.params.id);
    if (!korban) return res.status(404).json({ message: 'Data tidak ditemukan' });
    await korban.update(req.body);
    res.json({ message: 'Data korban diperbarui', korban });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};