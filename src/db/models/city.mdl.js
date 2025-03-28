'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      city.belongsTo(models.state)
    }
  }
  city.init({
    stateId: DataTypes.INTEGER,
    isCapital: DataTypes.BOOLEAN,
    name:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'city',
  });
  return city;
};