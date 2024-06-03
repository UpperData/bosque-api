'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {    
     await queryInterface.bulkInsert('civils', [
      {id:1,name: 'Casado',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name: 'Soltero',createdAt: new Date(),updatedAt: new Date()},
      {id:3,name: 'Divorciado',createdAt: new Date(),updatedAt: new Date()},
      {id:4,name: 'Viudo',createdAt: new Date(),updatedAt: new Date()}
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('civils', null, {});
  }
};
