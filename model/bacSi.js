const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');
const ThongTinCaNhan = require('./thongTinCaNhan')
const BacSi = sequelize.define('bacSi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  namKinhNghiem: DataTypes.INTEGER,
  caTruc: DataTypes.STRING
}, {
  timestamps: false
});

BacSi.belongsTo(ThongTinCaNhan, { foreignKey: 'thongTinCaNhanId' });

(async () => {
  await caNhan.sync({ alter: true })
})();

module.exports = BacSi