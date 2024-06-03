'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition =  await queryInterface.describeTable('employeeFiles');
    if (!tableDefinition.isActive) {
        
        await queryInterface.addColumn('employeeFiles', 'isActive', {
            defaultValue:true,
            type: Sequelize.BOOLEAN
            
        });
    }          
    return Promise.resolve();
},
  down: async (queryInterface, Sequelize) => {        
        await queryInterface.removeColumn('employeeFiles', 'isActive');
        
    }
};
