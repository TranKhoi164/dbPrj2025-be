const { sequelize } = require('./databaseConnection');
const ThongTinCaNhan = require('./model/thongTinCaNhan');
const BacSi = require('./model/bacSi');
const BenhNhan = require('./model/benhNhan');
const LichKham = require('./model/lichKham');
const DonKham = require('./model/donKham');
const ThanhToan = require('./model/thanhToan');

const runMigrations = async () => {
  try {
    console.log('🚀 Bắt đầu migration database...');

    // 1. Sync thongtincanhan table first
    console.log('📋 Đang tạo bảng thongtincanhans...');
    await ThongTinCaNhan.sync({ force: true });
    console.log('✅ Tạo bảng thongtincanhans thành công!');

    // 2. Sync bacsi table
    console.log('👨‍⚕️ Đang tạo bảng bacsis...');
    await BacSi.sync({ force: true });
    console.log('✅ Tạo bảng bacsis thành công!');

    // 3. Sync benhnhan table
    console.log('🤒 Đang tạo bảng benhnhans...');
    await BenhNhan.sync({ force: true });
    console.log('✅ Tạo bảng benhnhans thành công!');

    // 4. Sync lichkham table
    console.log('📅 Đang tạo bảng lichkhams...');
    await LichKham.sync({ force: true });
    console.log('✅ Tạo bảng lichkhams thành công!');

    // 5. Sync donkham table
    console.log('🏥 Đang tạo bảng donkhams...');
    await DonKham.sync({ force: true });
    console.log('✅ Tạo bảng donkhams thành công!');

    // 6. Sync thanhtoan table
    console.log('💰 Đang tạo bảng thanhtoans...');
    await ThanhToan.sync({ force: true });
    console.log('✅ Tạo bảng thanhtoans thành công!');

    console.log('🎉 Migration hoàn tất! Tất cả các bảng đã được tạo thành công.');

  } catch (error) {
    console.error('❌ Lỗi khi chạy migration:', error);
  } finally {
    await sequelize.close();
    console.log('📪 Đã đóng kết nối database.');
  }
};

// Chạy migration
runMigrations();
