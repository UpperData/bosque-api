'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      patient.belongsTo(models.patientType);
      patient.hasMany(models.appointment);
    }
  }
  patient.init({
    document: DataTypes.JSONB,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    edad: DataTypes.DATE,    
    phone: DataTypes.JSONB,
    patientTypeId: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'patient',
  });
  return patient;
};