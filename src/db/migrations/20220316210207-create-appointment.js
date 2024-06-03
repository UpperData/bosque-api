'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentTypeId:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{model:{tableName:'appointmentTypes',schema:'public'},key:'id'}
      },
      dateAppointment: {
        type: Sequelize.DATE,
        allowNull:false
      },
      hourAppointment: {
        type: Sequelize.STRING
      },
      foreignId: { //ID sumistrado por CANTV
        type: Sequelize.STRING
      },
      siniestroId: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.JSONB
      },
      isOpened: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:{tableName:'patients',schema:'public'},
          key:'id'
        }
      },
      medialPersonal: {
        type: Sequelize.JSONB,
        allowNull:false
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
    await queryInterface.dropTable('appointments');
  }
};