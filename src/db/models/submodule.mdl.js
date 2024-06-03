'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subModule.belongsTo(models.module);
      subModule.hasMany(models.permission);
    }
  };
  subModule.init({
    name: DataTypes.STRING,
    moduleId: DataTypes.INTEGER,
    sorting: DataTypes.INTEGER,
    description: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN,
    route:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subModule',
  });
  return subModule;
};