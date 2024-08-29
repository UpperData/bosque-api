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
      isActived:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      price:{
        type: Sequelize.STRING,
        allowNull: false
               
      },
      minStock:{
        type: Sequelize.STRING,
        allowNull: false               
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },      
      isSUW:{ 
        type: Sequelize.BOOLEAN,
        allowNull: false
      },      
      isPublished:{ 
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },      
      audit:{ 
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('articles');
  }
};