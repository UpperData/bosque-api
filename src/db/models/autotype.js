'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class autoType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  autoType.init({
    name: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'autoType',
  });
  return autoType;
};