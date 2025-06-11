const {sequelize} = require('../databaseConnection');
const {DataTypes} = require('sequelize');

const caNhan = sequelize.define('caNhan', {
  ten: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngaySinh: {
    type: DataTypes.DATE,
  },
  gioiTinh: {
    type: DataTypes.STRING,
  },
  sdt: {
    typ: DataTypes.STRING,
  }
}, {
  timestamps: false
});

(async () => {
  await caNhan.sync({ alter: true })
})();

module.exports = caNhan