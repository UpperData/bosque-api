'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subCategoryN1s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:{tableName:'subCategories',shema:'public'},key:'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true
      },
      order: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:0
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
    await queryInterface.dropTable('subCategoryN1s');
  }
};