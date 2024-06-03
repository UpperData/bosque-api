'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition =  await queryInterface.describeTable('inventories');
    if (!tableDefinition.inventories_article_fk) {
        
        await queryInterface.addConstraint('inventories', {
            type: 'foreign key',            
            fields:['articleId'],
            name:'inventories_article_fk',
            references:{
              table:'articles',
              field:'id'
            },
        });
    }   
       
    return Promise.resolve();
},
  down: async (queryInterface, Sequelize) => {        
        await queryInterface.removeConstraint('inventories','inventories_article_fk');
    }
};