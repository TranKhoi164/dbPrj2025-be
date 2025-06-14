const ThongTinCaNhan = require('./thongTinCaNhan');
const BacSi = require('./bacSi');
const BenhNhan = require('./benhNhan');

// Define associations here
ThongTinCaNhan.hasOne(BacSi, {
  foreignKey: 'thongTinCaNhanId',
  as: 'bacSi'
});
BacSi.belongsTo(ThongTinCaNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'thongTinCaNhan'
});

ThongTinCaNhan.hasOne(BenhNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'benhNhan'
});
BenhNhan.belongsTo(ThongTinCaNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'thongTinCaNhan'
});

module.exports = {
  ThongTinCaNhan,
  BacSi,
  BenhNhan
};