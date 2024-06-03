'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: true
      },
      isConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull: false
      },
      isActived: {
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull: false
      },
      pass: {
        type: Sequelize.STRING,        
        allowNull: false
      },
      hashConfirm: {
        type: Sequelize.TEXT
      },
      people: {
        type: Sequelize.JSONB
      },
      creater:{
        allowNull: false,
        type: Sequelize.JSONB
      },
      token:{
        allowNull: false,
        type: Sequelize.STRING
      },
      tries:{
        allowNull: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      secret: {
        type: Sequelize.JSONB
      },
      photo: {
        type: Sequelize.BLOB,
        allowNull:true
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounts');
  }
};