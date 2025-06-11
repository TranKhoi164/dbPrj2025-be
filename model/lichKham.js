const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');


const LichKham = sequelize.define('lichKham', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  thoiGian: DataTypes.DATE
}, {
  timestamps: false
});

(async () => {
  await LichKham.sync({ alter: true })
})();

module.exports = LichKham