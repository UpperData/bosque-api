'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class autoYearBrand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  autoYearBrand.init({
    autoyearId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'autoYearBrand',
  });
  return autoYearBrand;
};