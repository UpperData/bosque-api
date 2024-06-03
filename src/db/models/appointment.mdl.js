'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      appointment.belongsTo(models.patient);
      appointment.belongsTo(models.appointmentType);
      appointment.hasMany(models.medicalReport);
    }
  }
  appointment.init({
    dateAppointment: {
      type:DataTypes.DATE,
      allowNull:false
    },
    hourAppointment: {
      type:DataTypes.STRING
    },
    foreignId: {
      type:DataTypes.STRING,
    },
    siniestroId: {
      type:DataTypes.STRING
    },
    address: {
      type:DataTypes.JSONB
    },
    isOpened: {
      type:DataTypes.BOOLEAN,
      defaultValue:true
    },
    patientId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    medialPersonal: {
      type:DataTypes.JSONB,
      allowNull:false
    },
    appointmentTypeId:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'appointment',
  });
  return appointment;
};