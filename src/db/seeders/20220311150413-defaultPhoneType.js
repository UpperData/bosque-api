'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('phoneTypes', [
      {id:1,name: 'Movil',icon:'mdi-cellphone',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name: 'Hogar',icon:'mdi-home-circle-outline',createdAt: new Date(),updatedAt: new Date()},
      {id:3,name: 'Empresa',icon:'mdi-office-building',createdAt: new Date(),updatedAt: new Date()}
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('phoneTypes', null, {});
  }
};
