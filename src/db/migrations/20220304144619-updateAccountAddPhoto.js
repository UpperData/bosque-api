'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition =  await queryInterface.describeTable('accounts');
    if (!tableDefinition.photo) {
        
        await queryInterface.addColumn('accounts', 'photo', {
            type: Sequelize.BLOB,
            allowNull: true
        });
    }        
    return Promise.resolve();
},
  down: async (queryInterface, Sequelize) => {        
        await queryInterface.removeColumn('accounts', 'photo');
    }
};