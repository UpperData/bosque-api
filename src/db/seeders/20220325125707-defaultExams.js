'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('exams', [
      {id:1,name:'Perfil Covid 1',createdAt: new Date(),updatedAt: new Date()},
      {id:2,name:'Perfíl Covid 2',createdAt: new Date(),updatedAt: new Date()},
      {id:3,name:'Hematología Completa',createdAt: new Date(),updatedAt: new Date()},
      {id:4,name:'Uroanalisis',createdAt: new Date(),updatedAt: new Date()},
      {id:5,name:'Coproanalisis',createdAt: new Date(),updatedAt: new Date()},
      {id:6,name:'Plaquetas',createdAt: new Date(),updatedAt: new Date()},
      {id:7,name:'Osa',createdAt: new Date(),updatedAt: new Date()},
      {id:8,name:'HIV',createdAt: new Date(),updatedAt: new Date()},
      {id:9,name:'Urea',createdAt: new Date(),updatedAt: new Date()},
      {id:10,name:'Creatina',createdAt: new Date(),updatedAt: new Date()},
      {id:11,name:'Ecocardiograma',createdAt: new Date(),updatedAt: new Date()},
      {id:12,name:'Eco pulmonar',createdAt: new Date(),updatedAt: new Date()},
      {id:13,name:'Espirometría',createdAt: new Date(),updatedAt: new Date()}
      
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('exams', null, {});
  }
};
