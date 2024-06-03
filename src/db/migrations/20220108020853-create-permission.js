'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subModuleId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'subModules',schema:'public'},key:'id'}
      },
      operationId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'operations',schema:'public'},key:'id'}
      },
      isActived: {
        type: Sequelize.BOOLEAN
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
          fields: ["subModuleId","operationId"]
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permissions');
  }
};