'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    await queryInterface.bulkInsert('roles', [
      {id:4,name: 'Upper',isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {id:5,name: 'Admin',isActived:true,createdAt: new Date(),updatedAt: new Date()},

    ], {});
    //Model.sequelize.query(`SELECT setval('public.roles_id_seq',21, true)`);// actualiza secuencia
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('roles', null, {});
  }
};
