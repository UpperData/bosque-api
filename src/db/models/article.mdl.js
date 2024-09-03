'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      article.hasMany(models.lots);
    }
  }
  article.init({  
   
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese nombre del artículo'
        },notEmpty: {
          args: [true],
          msg: "Nombre del artículo es requerio",
        }
         
      }
    },
    isActived:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true,
      
    },
    description: {
      type:DataTypes.STRING,
      defaultValue:"N/A"
    },
    minStock: {
      type:DataTypes.INTEGER,
      defaultValue:"1"
    },
    price: {
      type:DataTypes.STRING,
      defaultValue:"0"
    },
    image: {
      type:DataTypes.STRING,
      defaultValue:"http://147.135.93.82/BM/genericImage.png",
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese URL de imagen'
        },notEmpty: {
          args: [true],
          msg: "URL imagen es requerida",
        }
         
      }

    },
    smallImage: {
      type:DataTypes.STRING,
      defaultValue:"http://147.135.93.82/BM/genericImage.png"
    },
    isSUW:{ // Sale by Unit Weight
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },
    isPublished:{ // Sale by Unit Weight
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },audit:{ 
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'article',
  });
  return article;
};