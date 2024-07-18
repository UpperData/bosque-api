'use strict';

const bcrypt = require('bcryptjs');
var revalidator = require('revalidator');
var schemaValidator = function (schema) {
    return function (value) {
        var results = revalidator.validate(value, schema);
        if (!results.valid) throw new Error(JSON.stringify(results.errors));
    };
};
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.hasMany(models.accountRole);
      account.hasMany(models.employeeFile);
    }
  };
  account.init({    
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Número de telefono ya esta en uso!'
      },
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,      
      allowNull: true
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: false
    },
    isActived: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: false
    },
    pass: {
      type: DataTypes.STRING,        
      allowNull: false,
      validate:{
        notNull: {
          args: [true],
          msg: 'Por favor ingrese password'
        },notEmpty: {
          args: [true],
          msg: "Por favor ingrese password",
        }
      },
      set(value) {        
        if (value.toString().length >= 6 && value.toString().length <= 20) {
          this.setDataValue('pass', bcrypt.hashSync(value, 10));
        } else {
          throw new Error('su password debe tener entre 6-20 caracteres!');
        }
      }
    },
    token:{
      allowNull: true,
      type: DataTypes.STRING
    },
    phone:{
      allowNull: false,
      type: DataTypes.STRING
    },
    secret:{
      type:DataTypes.JSONB, 
    },
    hashConfirm: {
      type: DataTypes.TEXT
    },
    creater:{
      type:DataTypes.JSONB,
      allowNull:false
    },
    tries:{
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
    },
    photo:{
      type:DataTypes.STRING,
      allowNull:true
    },
    people: {
      type: DataTypes.JSONB     
    }/*,departaments:{
      type: DataTypes.JSONB,
      validate:{
        schema: schemaValidator({
          type: "object",
          items: {
            type: "array",
            required: true,
            properties: {                               
              
              name:{
                type:"starting",required:true
              },
              isActived:{
                type:"boolean",required:true
              },
              starting:{
                type:"date",required:false
              } 
            }
          }
        })
      }
    }*/
    
  }, {
    sequelize,
    modelName: 'account'
  });
  return account;
};