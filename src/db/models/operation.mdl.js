'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class operation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  operation.init({
    name: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'operation',
  });
  return operation;
};