'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('accountRoles', [
      {accountId: 3,roleId:4,isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {accountId: 4,roleId:5,isActived:true,createdAt: new Date(),updatedAt: new Date()}
      
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('accountRoles', null, {});
  }
};
