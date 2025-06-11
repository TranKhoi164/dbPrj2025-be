const {sequelize} = require('../databaseConnection');
const {DataTypes} = require('sequelize');
const BenhNhan = require('./benhNhan')

const DonKham = sequelize.define('donKham', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  benhLy: DataTypes.STRING,
  mucDoBenh: DataTypes.STRING,
  dieuTri: DataTypes.STRING
}, {
  timestamps: false
});

DonKham.belongsTo(BenhNhan, { foreignKey: 'benhNhanId' });

(async () => {
  await DonKham.sync({ alter: true })
})();

module.exports = DonKham