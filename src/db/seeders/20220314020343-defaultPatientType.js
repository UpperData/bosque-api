'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('patientTypes', [
      {id:1,name:'Activo',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name:'Jubilado',createdAt: new Date(),updatedAt: new Date()},
      {id:3,name:'Sobreviviente',createdAt: new Date(),updatedAt: new Date()}      
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patientTypes', null, {});
  }
};
