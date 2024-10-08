'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('conditions', [{ id: 1, name: 'Disponible', description: 'Habilitado para la venta', createdAt: new Date(), updatedAt: new Date() }, { id: 2, name: 'Reservado', description: 'Reservado para un cliente', createdAt: new Date(), updatedAt: new Date() }, { id: 3, name: 'Vendido', description: 'Comprado por un cliente', createdAt: new Date(), updatedAt: new Date() }, { id: 4, name: 'Eliminado', description: 'Eliminado del inventario', createdAt: new Date(), updatedAt: new Date() }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conditions', null, {});
  }
};