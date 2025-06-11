const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');
const ThongTinCaNhan = require('./thongTinCaNhan')
const BenhNhan = sequelize.define('benhNhan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  diaChi: DataTypes.STRING
}, {
  timestamps: false
});

BenhNhan.belongsTo(ThongTinCaNhan, { foreignKey: 'thongTinCaNhanId' });

(async () => {
  await caNhan.sync({ alter: true })
})();

module.exports = BenhNhan