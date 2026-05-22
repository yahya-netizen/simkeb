
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Pastikan folder uploads ada sebelum multer digunakan
fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'laporan'), { recursive: true });

const syncDB = require('./config/syncDatabase');
syncDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/laporan',  require('./routes/laporanRoutes'));
app.use('/api/bencana',  require('./routes/bencanaRoutes'));
app.use('/api/relawan',  require('./routes/relawanRoutes'));
app.use('/api/logistik', require('./routes/logistikRoutes'));
app.use('/api/posko',    require('./routes/poskoRoutes'));
app.use('/api/korban',   require('./routes/korbanRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));