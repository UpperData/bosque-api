'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shoppingCar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      shoppingCar.belongsTo(models.account)
    }
  }
  shoppingCar.init({
    accountId: DataTypes.INTEGER,
    items: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'shoppingCar',
  });
  return shoppingCar;
};