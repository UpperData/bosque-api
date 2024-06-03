'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('appointmentTypes', [
      {id:1,name:'Domiciliaria',icon:'mdi-ambulance',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name:'APS',icon:'mdi-hospital-building',createdAt: new Date(),updatedAt: new Date()}
      
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('appointmentTypes', null, {});
  }
};
