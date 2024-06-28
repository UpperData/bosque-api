'use strict';
const {
  Model,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      lots.hasMany(models.itemLot);
    }
  }
  lots.init({
    articleId: DataTypes.INTEGER,    
    isActived: DataTypes.BOOLEAN,    
    receivedDate: DataTypes.DATE,
    expDate: DataTypes.DATE,
    note: DataTypes.STRING,
    audit:DataTypes.JSONB 
  }, {
    sequelize,
    modelName: 'lots',
  });
  return lots;
};