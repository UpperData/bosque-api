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
      shoppingCar.belongsTo(models.account);
      shoppingCar.belongsTo(models.itemLot);
      shoppingCar.belongsTo(models.orderStatus);
    }
  }
  shoppingCar.init({
    accountId: DataTypes.INTEGER,
    itemLotId: DataTypes.INTEGER,
    dispatch: DataTypes.STRING,
    qty : DataTypes.STRING,
    orderStatusId:DataTypes.INTEGER,
    audit:DataTypes.JSONB,
    discount:DataTypes.STRING,
    finalWeigth:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'shoppingCar',
  });
  return shoppingCar;
};