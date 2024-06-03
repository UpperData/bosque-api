'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      inventory.belongsTo(models.article);
      inventory.belongsTo(models.autoType)
      
    }
  }
  inventory.init({
    articleId: {
      type: DataTypes.INTEGER,
      unique:true,
      references:{model:{tableName:'articles',schema:'public'},key:'id'},
      validate:{
        customValidator(value) {
          if (value === null || value <0) {
            throw new Error("debe ingresar in articulo valido");
          }
        }
      }
    },
    minStock: {
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0,
      validate:{
        customValidator(value) {
          if (value === null || value <0) {
            throw new Error("el valor del stock minimo debe ser mayor o igual a cero (0) ");
          }
        }
      }
    },
    existence: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese la existencia actual'
        },notEmpty: {
          args: [true],
          msg: "Por favor ingrese la existencia actual",
        },isNumeric: {
          args: [false],
          msg: "Por favor ingrese la existencia actual en números enteros",
        }
      }
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull:false,
      defaultValue:0,
      validate:{
        customValidator(value) {
          if (value === null || value <0) {
            throw new Error("Debe ingresar precio mayor a cero(0)");
          }
        }
      }
  },category:{
    type:DataTypes.JSONB,
    allowNull:true,
    validate:{
      customValidator(value) {
        if (value === null || value <0) {
          throw new Error("De indicar la categoría del artículo");
        }
      }
    }
  },sku:{
      type:DataTypes.STRING,
      allowNull:true,
  },autoTypeId:{
    type:DataTypes.INTEGER,
    allowNull:true,
    validate:{
      customValidator(value) {
        if (value === null || value <0) {
          throw new Error("De indicar el tipo de vehiculo");
        }
      }
    }
  },filter:{
    type:DataTypes.JSONB,
    allowNull:false,
    defaultValue:[{}],
    validate:{
      customValidator(value) {
        if (value === null || value <0) {
          throw new Error("De indicar descripción del vehiculo");
        }
      }
    }
  },description:{
      type:DataTypes.STRING,
      allowNull:true
  },tags:{
    type:DataTypes.STRING,
    allowNull:true
  },photo:{
    type:DataTypes.JSONB,
    allowNull:true,
    validate:{
      customValidator(value) {
        if (value === null || value <0) {
          throw new Error("De indicar agregar fotos del artículo");
        }
      }
    }
  },isPublished:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }
  }, {
    sequelize,
    modelName: 'inventory',
  });
  return inventory;
};