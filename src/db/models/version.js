'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class version extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  version.init({
    modelId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'version',
  });
  return version;
};