'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cargos', [
      {id: 1,name:"Asistente Adminstrativo",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      {id: 2,name:"Médico",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      {id: 3,name:"Médico especialista",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      {id: 4,name:"Enfermera",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      {id: 5,name:"Chofer",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      {id: 6,name:"Administrador General",departamentId:1,createdAt: new Date(),updatedAt: new Date()},
      
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('cargos', null, {}); 
    
  }
};
