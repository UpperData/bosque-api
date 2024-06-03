'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storeId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true //,
        //references:{model:{tableName:'stores',schema:'public'},key:'id'}        
      },
      isActived:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      doctorId:{
        type: Sequelize.INTEGER,
        allowNull: true
               
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('articles');
  }
};