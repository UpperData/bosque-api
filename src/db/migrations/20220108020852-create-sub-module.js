'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subModules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        unique:true,
        type: Sequelize.STRING,
        allowNull: false
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:{tableName:'modules',schema:'public'},key:'id'}
      },
      sorting: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subModules');
  }
};