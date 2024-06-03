'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accountRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      accountRole.belongsTo(models.account);
      accountRole.belongsTo(models.role);
    }
  };
  accountRole.init({
    accountId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    isActived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'accountRole',
  });
  return accountRole;
};