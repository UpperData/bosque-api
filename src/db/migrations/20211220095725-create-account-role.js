'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accountRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:{tableName:'accounts',schema:'public'},key:'id'}
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:{tableName:'roles',schema:'public'},key:'id'}
      },
      isActived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
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
          fields: ["accountId","roleId"]
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accountRoles');
  }
};