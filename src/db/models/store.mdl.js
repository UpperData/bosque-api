'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      store.belongsTo(models.parroquia,{ foreignKey: 'parroquiaId'} )
    }
  }
  store.init({
    accountId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    logo: {
      type:DataTypes.TEXT
    },
    description: {
      type:DataTypes.STRING
    },
    isItHaveBuild: {
      type:DataTypes.BOOLEAN
    },
    phone: {
      type:DataTypes.STRING,
      allowNull:false
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false
    },
    parroquiaId: {
      type:DataTypes.INTEGER,
      allowNull:false
    
    },
    storeTypeId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    isActived: {
      type:DataTypes.BOOLEAN,
      defaultValue:true
    },
    fiscalInfo: {
      type:DataTypes.JSONB,
      allowNull:false
    },
    deliveryInfo: {
      type:DataTypes.JSONB,
      defaultValue:"{isActived:false}"
    }
  }, {
    sequelize,
    modelName: 'store',
  });
  return store;
};