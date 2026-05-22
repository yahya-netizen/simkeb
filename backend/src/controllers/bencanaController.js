const { Bencana, Korban, Posko, Logistik } = require('../models');

exports.getBencanaAktif = async (req, res) => {
  try {
    const bencana = await Bencana.findAll({
      where: { status: 'aktif' },
      include: [
        { model: Korban },
        { model: Posko }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bencana);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBencana = async (req, res) => {
  try {
    const bencana = await Bencana.findAll({
      include: [{ model: Korban }, { model: Posko }],
      order: [['tanggal_kejadian', 'DESC']]
    });
    res.json(bencana);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDetailBencana = async (req, res) => {
  try {
    const bencana = await Bencana.findByPk(req.params.id, {
      include: [{ model: Korban }, { model: Posko }, { model: Logistik }]
    });
    if (!bencana) return res.status(404).json({ message: 'Bencana tidak ditemukan' });
    res.json(bencana);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tambahBencana = async (req, res) => {
  try {
    const bencana = await Bencana.create(req.body);
    res.status(201).json({ message: 'Data bencana ditambahkan', bencana });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBencana = async (req, res) => {
  try {
    const bencana = await Bencana.findByPk(req.params.id);
    if (!bencana) return res.status(404).json({ message: 'Bencana tidak ditemukan' });
    await bencana.update(req.body);
    res.json({ message: 'Data bencana diperbarui', bencana });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hapusBencana = async (req, res) => {
  try {
    const bencana = await Bencana.findByPk(req.params.id);
    if (!bencana) return res.status(404).json({ message: 'Bencana tidak ditemukan' });
    await bencana.destroy(); // soft delete karena paranoid: true pada model
    res.json({ message: 'Data bencana dihapus (soft delete)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};