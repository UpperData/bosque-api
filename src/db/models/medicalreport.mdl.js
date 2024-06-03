'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medicalReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      medicalReport.belongsTo(models.appointment);
    }
  }
  medicalReport.init({
    appointmentId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false
    },
    withExams: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    withMedicine: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    medicines: {
      type:DataTypes.JSONB
    },
    exams: {
      type:DataTypes.JSONB
    },
    dosage: {
      type:DataTypes.TEXT
    },
    otherExams: {
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'medicalReport',
  });
  return medicalReport;
};