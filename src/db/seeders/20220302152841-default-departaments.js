'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departaments', [
      {id: 1,name:"Dirección General CEO",createdAt: new Date(),updatedAt: new Date()},
      {id: 2,name:"Gerencia Operaciones COO",createdAt: new Date(),updatedAt: new Date()},
      {id: 3,name:"Gerencia Comercial CSO",createdAt: new Date(),updatedAt: new Date()},
      {id: 4,name:"Gerencia de Mercadeo CMO",createdAt: new Date(),updatedAt: new Date()},
      {id: 5,name:"Gerencia de Recursos Humanos CHRO",createdAt: new Date(),updatedAt: new Date()},      
      {id: 6,name:"Gerencia Finanzas CFO",createdAt: new Date(),updatedAt: new Date()},
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('departaments', null, {}); 
    
  }
};
