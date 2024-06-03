'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeFileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:{tableName:'employeeFiles',schema:'public'},key:'id'}
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActived: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    await queryInterface.dropTable('fees');
  }
};