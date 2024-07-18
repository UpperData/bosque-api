'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('orderStatuses', [
      {
        id:1,
        name: 'Reservado',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:2,
        name: 'Procesado',
        description:'Procesado al gusto del cliente',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:3,
        name: 'Por Pagar',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:4,
        name: 'Pagado',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:5,
        name: 'Entregado',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:6,
        name: 'Anulado por mi (cliente)',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },{
        id:7,
        name: 'Anulado FBM',
        description:'Apartador para la compra',
        createdAt: new Date(),
        updatedAt: new Date()
 
      },], {});
    
  },

  async down (queryInterface, Sequelize) {
  
    await queryInterface.bulkDelete('orderStatuses', null, {});
    
  }
};
