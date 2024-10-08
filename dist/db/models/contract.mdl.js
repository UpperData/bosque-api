'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contract.init({
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    comission: DataTypes.DECIMAL,
    storeId: DataTypes.INTEGER,
    isActived: DataTypes.BOOLEAN,
    fileContract: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contract'
  });
  return contract;
};