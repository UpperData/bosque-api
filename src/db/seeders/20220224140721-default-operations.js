'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('operations', [
      {id: 1,name:"Crea",isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {id: 2,name:"Edita",isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {id: 3,name:"Consulta",isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {id: 4,name:"Imprime",isActived:true,createdAt: new Date(),updatedAt: new Date()},
      {id: 5,name:"Referencia",isActived:true,createdAt: new Date(),updatedAt: new Date()},
      
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('operations', null, {}); 
    
  }
};
