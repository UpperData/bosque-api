'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      module.hasMany(models.subModule );
    }
  };
  module.init({
    name: DataTypes.STRING,
    rute: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN,
    sorting: DataTypes.INTEGER,
    icon: DataTypes.STRING,
    description:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'module',
  });
  return module;
};