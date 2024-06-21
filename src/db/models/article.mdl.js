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
      article.hasMany(models.assignment);
    }
  }
  article.init({  
   
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese nombre del articulo'
        },notEmpty: {
          args: [true],
          msg: "Nombre del articulo es requerio",
        }
         
      }
    },
    isActived:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },
    description: {
      type:DataTypes.STRING,
      defaultValue:"N/A"
    },
    minStock: {
      type:DataTypes.INTEGER,
      defaultValue:"1"
    },
    image: {
      type:DataTypes.STRING,
      defaultValue:"https://drive.google.com/file/d/1rNxJwQRgurZpeSyw8FJl98QRarzqjYCR/view?usp=sharing"
    }
  }, {
    sequelize,
    modelName: 'article',
  });
  return article;
};