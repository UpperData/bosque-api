'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here     
      assignment.belongsTo(models.account);  
      assignment.belongsTo(models.article);
    }
  }
  assignment.init({
    accountId: {
      type:DataTypes.INTEGER,  
      allowNull:false,    
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese ID del médico'
        },notEmpty: {
          args: [true],
          msg: "Por favor ingrese ID del médico",
        }
      }
    },
    articleId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese ID del suministro'
        },notEmpty: {
          args: [true],
          msg: "Por favor ingrese ID del suministro",
        }
      }
    },
    quantity: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese la cantidad de articulos'
        },notEmpty: {
          args: [true],
          msg: "Por favor ingrese la cantidad de articulos",
        },isNumeric: {
          args: [false],
          msg: "Por favor ingrese la cantidad en números enteros",
        }
      }
    },
    responsible:{ 
      type:DataTypes.JSONB,
      allowNull:false
  },
  isActived:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true
  }
  }, {
    sequelize,
    modelName: 'assignment',
  });
  return assignment;
};