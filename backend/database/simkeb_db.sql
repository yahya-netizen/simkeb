-- ============================================================
--  SIMKEB - Sistem Informasi Manajemen Kebencanaan
--  Database: simkeb_db
--  Generated from Sequelize models
-- ============================================================

CREATE DATABASE IF NOT EXISTS simkeb_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE simkeb_db;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT           NOT NULL AUTO_INCREMENT,
  username      VARCHAR(255)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  nama_lengkap  VARCHAR(255)  NOT NULL,
  no_hp         VARCHAR(255),
  role          ENUM('admin','petugas','relawan','masyarakat') NOT NULL,
  createdAt     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id             INT          NOT NULL AUTO_INCREMENT,
  userId         INT,
  email          VARCHAR(255) NOT NULL UNIQUE,
  login_terakhir DATETIME,
  createdAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_admins_user FOREIGN KEY (userId) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. PETUGAS
-- ============================================================
CREATE TABLE IF NOT EXISTS petugas (
  id        INT          NOT NULL AUTO_INCREMENT,
  userId    INT,
  NIP       VARCHAR(255) UNIQUE,
  instansi  VARCHAR(255),
  createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_petugas_user FOREIGN KEY (userId) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. RELAWAN
-- ============================================================
CREATE TABLE IF NOT EXISTS relawan (
  id                   INT          NOT NULL AUTO_INCREMENT,
  userId               INT,
  no_identitas         VARCHAR(255) UNIQUE,
  keahlian             ENUM('medis','logistik','evakuasi','komunikasi','umum') DEFAULT 'umum',
  status_ketersediaan  ENUM('standby','bertugas','selesai') DEFAULT 'standby',
  status_aktif         TINYINT(1)   DEFAULT 0,
  tgl_daftar           DATETIME     DEFAULT CURRENT_TIMESTAMP,
  createdAt            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_relawan_user FOREIGN KEY (userId) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. MASYARAKAT
-- ============================================================
CREATE TABLE IF NOT EXISTS masyarakat (
  id            INT          NOT NULL AUTO_INCREMENT,
  userId        INT,
  no_identitas  VARCHAR(255),
  tgl_daftar    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_masyarakat_user FOREIGN KEY (userId) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. LAPORAN  (bisa dibuat tanpa login → petugasId nullable)
-- ============================================================
CREATE TABLE IF NOT EXISTS laporan (
  id_laporan        INT          NOT NULL AUTO_INCREMENT,
  nama_pelapor      VARCHAR(255) NOT NULL,
  jenis             VARCHAR(255) NOT NULL,
  lokasi            VARCHAR(255) NOT NULL,
  koordinat         VARCHAR(255),
  tingkat_keparahan ENUM('ringan','sedang','berat') DEFAULT 'ringan',
  foto              VARCHAR(255),
  deskripsi         TEXT,
  status            ENUM('dilaporkan','terverifikasi','ditolak','selesai') DEFAULT 'dilaporkan',
  alasan_tolak      TEXT,
  petugasId         INT          DEFAULT NULL,
  createdAt         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_laporan),
  CONSTRAINT fk_laporan_petugas FOREIGN KEY (petugasId) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. BENCANA
-- ============================================================
CREATE TABLE IF NOT EXISTS bencana (
  id_bencana      INT          NOT NULL AUTO_INCREMENT,
  nama_bencana    VARCHAR(255) NOT NULL,
  jenis           VARCHAR(255) NOT NULL,
  tingkat_parah   ENUM('ringan','sedang','berat','kritis') DEFAULT 'sedang',
  lokasi          VARCHAR(255) NOT NULL,
  koordinat       VARCHAR(255),
  deskripsi       TEXT,
  tanggal_kejadian DATETIME    NOT NULL,
  status          ENUM('aktif','ditangani','selesai') DEFAULT 'aktif',
  createdAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_bencana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. KORBAN
-- ============================================================
CREATE TABLE IF NOT EXISTS korban (
  id_korban         INT  NOT NULL AUTO_INCREMENT,
  bencanaId         INT  NOT NULL,
  jumlah_meninggal  INT  DEFAULT 0,
  jumlah_luka       INT  DEFAULT 0,
  jumlah_pengungsi  INT  DEFAULT 0,
  jumlah_hilang     INT  DEFAULT 0,
  keterangan        TEXT,
  createdAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_korban),
  CONSTRAINT fk_korban_bencana FOREIGN KEY (bencanaId) REFERENCES bencana(id_bencana)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. POSKO
-- ============================================================
CREATE TABLE IF NOT EXISTS posko (
  id_posko         INT          NOT NULL AUTO_INCREMENT,
  bencanaId        INT          NOT NULL,
  nama_posko       VARCHAR(255) NOT NULL,
  lokasi           VARCHAR(255) NOT NULL,
  koordinat        VARCHAR(255),
  kapasitas        INT          DEFAULT 0,
  jumlah_pengungsi INT          DEFAULT 0,
  status           ENUM('aktif','penuh','tutup') DEFAULT 'aktif',
  createdAt        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_posko),
  CONSTRAINT fk_posko_bencana FOREIGN KEY (bencanaId) REFERENCES bencana(id_bencana)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. LOGISTIK
-- ============================================================
CREATE TABLE IF NOT EXISTS logistik (
  id_barang   INT          NOT NULL AUTO_INCREMENT,
  bencanaId   INT          NOT NULL,
  nama_barang VARCHAR(255) NOT NULL,
  jenis       ENUM('makanan','obat','pakaian','peralatan','lainnya') DEFAULT 'lainnya',
  satuan      VARCHAR(255) NOT NULL,
  stok        INT          DEFAULT 0,
  tipe        ENUM('masuk','keluar') NOT NULL,
  jumlah      INT          NOT NULL,
  poskoId     INT          DEFAULT NULL,
  keterangan  TEXT,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_barang),
  CONSTRAINT fk_logistik_bencana FOREIGN KEY (bencanaId) REFERENCES bencana(id_bencana)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. PENUGASAN_RELAWAN
-- ============================================================
CREATE TABLE IF NOT EXISTS penugasan_relawan (
  id             INT  NOT NULL AUTO_INCREMENT,
  relawanId      INT,
  bencanaId      INT,
  status         ENUM('standby','bertugas','selesai') DEFAULT 'standby',
  tgl_penugasan  DATETIME DEFAULT CURRENT_TIMESTAMP,
  catatan        TEXT,
  createdAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_penugasan_relawan FOREIGN KEY (relawanId) REFERENCES relawan(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_penugasan_bencana FOREIGN KEY (bencanaId) REFERENCES bencana(id_bencana)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED DATA — akun default untuk testing
-- Password di bawah adalah hash bcrypt dari "password123"
-- ============================================================

INSERT INTO users (username, password, nama_lengkap, no_hp, role) VALUES
('admin',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', '081200000001', 'admin'),
('petugas1','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Budi Santoso',  '081200000002', 'petugas'),
('relawan1','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Siti Rahayu',   '081200000003', 'relawan'),
('warga1',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Andi Wijaya',   '081200000004', 'masyarakat');

INSERT INTO admins (userId, email) VALUES (1, 'admin@simkeb.id');

INSERT INTO petugas (userId, NIP, instansi) VALUES (2, '197801012005011001', 'BPBD Kota Tasikmalaya');

INSERT INTO relawan (userId, no_identitas, keahlian, status_ketersediaan, status_aktif) VALUES
(3, '3201010101010001', 'medis', 'standby', 1);

INSERT INTO masyarakat (userId, no_identitas) VALUES (4, '3201010101010002');
