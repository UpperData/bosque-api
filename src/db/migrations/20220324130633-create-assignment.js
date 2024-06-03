'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        type: Sequelize.INTEGER,        
        references:{model:{tableName:'accounts',schema:'public'},key:'id'}
      },
      articleId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'articles',schema:'public'},key:'id'}
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      responsible: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      uniqueKeys: {
        accountRolesKey: {
          customIndex: true,
          fields: ["articleId","accountId"]
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assignments');
  }
};