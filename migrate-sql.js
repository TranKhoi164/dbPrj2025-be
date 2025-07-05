const { sequelize } = require('./databaseConnection');

const createTables = async () => {
  try {
    console.log('🚀 Bắt đầu tạo database bằng raw SQL...');

    // 1. Tạo bảng thongtincanhans
    console.log('📋 Đang tạo bảng thongtincanhans...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS thongtincanhans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        CCCD VARCHAR(12) UNIQUE NOT NULL,
        ten VARCHAR(255) NOT NULL,
        ngaySinh DATE,
        gioiTinh ENUM('Nam', 'Nữ') NOT NULL,
        sdt VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tạo bảng thongtincanhans thành công!');

    // 2. Tạo bảng bacsis
    console.log('👨‍⚕️ Đang tạo bảng bacsis...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS bacsis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        thongTinCaNhanId INT NOT NULL,
        namKinhNghiem INT NOT NULL,
        caTruc ENUM('Sáng', 'Chiều', 'Tối') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (thongTinCaNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tạo bảng bacsis thành công!');

    // 3. Tạo bảng benhnhans
    console.log('🤒 Đang tạo bảng benhnhans...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS benhnhans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        thongTinCaNhanId INT NOT NULL,
        diaChi TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (thongTinCaNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tạo bảng benhnhans thành công!');

    // 4. Tạo bảng lichkhams
    console.log('📅 Đang tạo bảng lichkhams...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS lichkhams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ngay DATE NOT NULL,
        gio TIME NOT NULL,
        benhNhanId INT,
        bacSiId INT NOT NULL,
        trangThai ENUM('cho', 'huy', 'hoan_thanh', 'ban') DEFAULT 'cho',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (benhNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE,
        FOREIGN KEY (bacSiId) REFERENCES thongtincanhans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tạo bảng lichkhams thành công!');

    // 5. Tạo bảng donkhams
    console.log('🏥 Đang tạo bảng donkhams...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS donkhams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        benhLy TEXT,
        mucDoBenh ENUM('Nhẹ', 'Trung bình', 'Nặng') DEFAULT 'Nhẹ',
        dieuTri TEXT,
        lichKhamId INT NOT NULL,
        benhNhanId INT NOT NULL,
        bacSiId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lichKhamId) REFERENCES lichkhams(id) ON DELETE CASCADE,
        FOREIGN KEY (benhNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE,
        FOREIGN KEY (bacSiId) REFERENCES thongtincanhans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tạo bảng donkhams thành công!');

    // 6. Tạo bảng thanhtoans
    console.log('💰 Đang tạo bảng thanhtoans...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS thanhtoans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chiPhi DECIMAL(10,2) NOT NULL,
        phuongThucThanhToan ENUM('Tiền mặt', 'Chuyển khoản', 'Thẻ') DEFAULT 'Tiền mặt',
        hoanThanh BOOLEAN DEFAULT FALSE,
        theBhyt VARCHAR(50),
        lichKhamId INT NOT NULL,
        benhNhanId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (lichKhamId) REFERENCES lichkhams(id) ON DELETE CASCADE,
        FOREIGN KEY (benhNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tạo bảng thanhtoans thành công!');

    // Tạo các index để tối ưu hiệu suất
    console.log('📊 Đang tạo indexes...');
    await sequelize.query(`CREATE INDEX idx_cccd ON thongtincanhans(CCCD)`);
    await sequelize.query(`CREATE INDEX idx_lichkham_ngay ON lichkhams(ngay)`);
    await sequelize.query(`CREATE INDEX idx_lichkham_bacsi ON lichkhams(bacSiId)`);
    await sequelize.query(`CREATE INDEX idx_lichkham_benhnhan ON lichkhams(benhNhanId)`);
    console.log('✅ Tạo indexes thành công!');

    console.log('🎉 Migration hoàn tất! Tất cả các bảng đã được tạo thành công.');

  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error);
  } finally {
    await sequelize.close();
    console.log('📪 Đã đóng kết nối database.');
  }
};

// Chạy migration
createTables();
