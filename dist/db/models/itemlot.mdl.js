'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class itemLot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      itemLot.belongsTo(models.condition);
      itemLot.belongsTo(models.lots);
      itemLot.hasMany(models.shoppingCar);
    }
  }
  itemLot.init({
    lotId: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.DECIMAL
    },
    conditionId: {
      type: DataTypes.INTEGER
    },
    note: {
      type: DataTypes.STRING,
      defaultValue: "n/a"
    },
    numItem: {
      type: DataTypes.INTEGER
    },
    audit: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    modelName: 'itemLot'
  });
  return itemLot;
};