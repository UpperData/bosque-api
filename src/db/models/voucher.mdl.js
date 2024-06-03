'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  voucher.init({
    employeeFileId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    isActived: DataTypes.BOOLEAN,
    details: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'voucher',
  });
  return voucher;
};