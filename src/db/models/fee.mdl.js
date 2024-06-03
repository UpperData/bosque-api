'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      fee.belongsTo(models.employeeFile);
    }
  }
  fee.init({
    employeeFileId: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'fee',
  });
  return fee;
};