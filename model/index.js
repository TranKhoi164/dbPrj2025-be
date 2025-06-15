const ThongTinCaNhan = require("./thongTinCaNhan");
const BacSi = require("./bacSi");
const BenhNhan = require("./benhNhan");
const DonKham = require("./donKham");
// Define associations here

ThongTinCaNhan.hasOne(BacSi, {
	foreignKey: "thongTinCaNhanId",
	as: "bacSi",
});
BacSi.belongsTo(ThongTinCaNhan, {
	foreignKey: "thongTinCaNhanId",
	as: "thongTinCaNhan",
});

ThongTinCaNhan.hasOne(BenhNhan, {
	foreignKey: "thongTinCaNhanId",
	as: "benhNhan",
});
BenhNhan.belongsTo(ThongTinCaNhan, {
	foreignKey: "thongTinCaNhanId",
	as: "thongTinCaNhan",
});

ThongTinCaNhan.hasMany(DonKham, { foreignKey: 'bacSiId', as: 'donKhamBacSi' });
ThongTinCaNhan.hasMany(DonKham, { foreignKey: 'benhNhanId', as: 'donKhamBenhNhan' });
DonKham.belongsTo(ThongTinCaNhan, { foreignKey: 'bacSiId', as: 'bacSi' });
DonKham.belongsTo(ThongTinCaNhan, { foreignKey: 'benhNhanId', as: 'benhNhan' });

// BenhNhan.hasMany(DonKham, {
// 	foreignKey: "benhNhanId",
// 	as: "donKhams",
// });
// DonKham.belongsTo(BenhNhan, { foreignKey: "benhNhanId", as: "benhNhan" });

// BacSi.hasMany(DonKham, {
//   foreignKey: 'bacSiId',
//   as: 'donKhams'
// });
// DonKham.belongsTo(BacSi, {
//   foreignKey: 'bacSiId',
//   as: 'bacSi'
// });

module.exports = {
	ThongTinCaNhan,
	BacSi,
	BenhNhan,
	DonKham,
};
