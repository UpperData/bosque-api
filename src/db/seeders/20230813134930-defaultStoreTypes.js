'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('storeTypes', [
      {id:1,name:'Persona',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name:'Empresa',createdAt: new Date(),updatedAt: new Date()},
    
      
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('storeTypes', null, {});
  }
};
