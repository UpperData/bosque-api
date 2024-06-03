'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grantRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      grantRole.belongsTo(models.role);
      grantRole.belongsTo(models.permission);
    }
  };
  grantRole.init({
    roleId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'grantRole',
  });
  return grantRole;
};