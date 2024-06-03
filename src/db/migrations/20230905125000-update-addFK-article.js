module.exports = {
    up: async (queryInterface, Sequelize) => {
             
      await queryInterface.addConstraint('articles', {
          type: 'FOREIGN KEY',
          name: 'article_store_fk', // useful if using queryInterface.removeConstraint
          fields:['storeId'],
          references: {
          table: 'stores',
          field: 'id',
          },
          onDelete: 'no action',
          onUpdate: 'no action',
      })
      return Promise.resolve();
  },
    down: async (queryInterface, Sequelize) => {
          await queryInterface.removeConstraint('articles', 'article_store_fk');
          
      }
  };