'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subDepartament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subDepartament.belongsTo(models.departament);
    }
  }
  subDepartament.init({
    name: DataTypes.STRING,
    departamentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'subDepartament',
  });
  return subDepartament;
};