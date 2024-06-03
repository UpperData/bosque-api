'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:'articles',
            schema:'public'
          },
          key:'id'
        }
      },
      minStock: {
        type: Sequelize.INTEGER
      },
      existence: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      category: {
        type: Sequelize.JSONB
      },
      sku: {
        type: Sequelize.JSONB
      },
      filter: {
        type: Sequelize.JSONB
      },
      description: {
        type: Sequelize.JSONB
      },
      tags: {
        type: Sequelize.JSONB
      },
      photo: {
        type: Sequelize.JSONB
      },
      isPublished:{          
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue:false
      },
      autoTypeId:{
          type: Sequelize.INTEGER,
          allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};