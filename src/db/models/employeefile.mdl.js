
'use strict';
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
  class employeeFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      employeeFile.belongsTo(models.account);
      employeeFile.hasMany(models.fee);

    }
  }
  employeeFile.init({
    fisrtName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    documentId: {
      type:DataTypes.JSONB,
      allowNull:false
    },
    address: {
      type:DataTypes.JSONB,
      allowNull:false
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      values:{
        isEmail:true
      }
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull:true
    },cargo: {
      type:DataTypes.JSONB,
      allowNull:false
    },
    phone:{
      type:DataTypes.JSONB,
      allowNull:false,
        validate: {
           schema: schemaValidator({
               type: "array",
               properties: {
                   phoneType: { type: "string",uniqueItems: true, required: true },
                   phoneNumber:{ type: "string", dependencies: 'phoneType', required: true }                                  
               }
           })
        }    
      },
    photo: {
      type:DataTypes.STRING
    },
    digitalDoc: {
      type:DataTypes.STRING
    },
    observation: {
      type:DataTypes.TEXT
    },
    academic: {
      type:DataTypes.JSONB,
      allowNull:true
    },
    cursos: {
      type:DataTypes.JSONB
    },
    experience: {
      type:DataTypes.JSONB
    },
    contacto: {
      type:DataTypes.JSONB
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'employeeFile',
  });
  return employeeFile;
};