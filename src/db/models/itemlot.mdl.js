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
    }
  }
  itemLot.init({    
    lotId: DataTypes.INTEGER,    
    weight: DataTypes.DECIMAL,
    conditionId: DataTypes.INTEGER,
    note: DataTypes.STRING,
    numItem: DataTypes.INTEGER,
    audit:DataTypes.JSONB 
  }, {
    sequelize,
    modelName: 'itemLot',
  });
  return itemLot;
};