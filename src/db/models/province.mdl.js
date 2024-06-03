'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      province.belongsTo(models.state)
    }
  }
  province.init({
    name: {
      type:DataTypes.STRING,      
      allowNull:false
    },
    stateId: {
      type:DataTypes.INTEGER,      
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'province',
  });
  return province;
};