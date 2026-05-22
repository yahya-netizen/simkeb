const { User, Admin } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const existing = await User.findOne({ where: { username: 'admin' } });
    if (existing) {
      console.log('Admin account already exists.');
      process.exit(0);
    }
    
    const hashed = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      username: 'admin',
      password: hashed,
      nama_lengkap: 'Administrator SIMKEB',
      role: 'admin'
    });
    
    await Admin.create({
      userId: user.id,
      email: 'admin@simkeb.local'
    });
    
    console.log('✅ Akun Admin berhasil dibuat!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Gagal membuat admin:', err);
    process.exit(1);
  }
}

createAdmin();
