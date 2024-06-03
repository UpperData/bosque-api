'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('grantRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'roles',schema:'public'},key:'id'}
      },
      permissionId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'permissions',schema:'public'},key:'id'}
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
          fields: ["roleId","permissionId"]
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('grantRoles');
  }
};