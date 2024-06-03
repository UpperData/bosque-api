'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subCategoryN1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subCategoryN1.belongsTo(models.subCategory)
    }
  }
  subCategoryN1.init({
    subCategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subCategoryN1',
  });
  return subCategoryN1
};