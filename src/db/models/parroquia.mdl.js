'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class parroquia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      parroquia.belongsTo(models.province)
    }
  }
  parroquia.init({
    name: {
      type:DataTypes.STRING,      
      allowNull:false
    },
    provinceId: {
      type:DataTypes.INTEGER,      
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'parroquia',
  });
  return parroquia;
};