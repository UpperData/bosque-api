'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicalReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        unique:true,
        allowNull:false,
        references:{
          model:{tableName:'appointments',schema:'public'},
          key:'id'
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      withExams: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull:false
      },
      withMedicine: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull:false
      },
      medicines: {
        type: Sequelize.JSONB
      },
      exams: {
        type: Sequelize.JSONB
      },
      dosage:{
        type: Sequelize.TEXT
      },
      otherExams: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medicalReports');
  }
};