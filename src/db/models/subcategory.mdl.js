'use strict';
const { INTEGER } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subCategory.belongsTo(models.mainCategory);
      subCategory.hasMany(models.subCategoryN1);
    }
  }
  subCategory.init({
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    url: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    mainCategoryId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'subCategory',
  });
  return subCategory;
};