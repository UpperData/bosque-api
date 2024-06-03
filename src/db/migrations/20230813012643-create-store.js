'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:{tableName:'accounts',schema:'public'},key:'id'}
      },
      name: {
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'dirección de Email ya esta en uso!'
        }
      },
      logo: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isItHaveBuild: {
        type: Sequelize.BOOLEAN
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      parroquiaId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'parroquia',schema:'public'},key:'id'}
      },
      storeTypeId: {
        type: Sequelize.INTEGER,
        references:{model:{tableName:'storeTypes',schema:'public'},key:'id'}
      }, 
      isActived: {
        type: Sequelize.BOOLEAN
      },
      fiscalInfo: {
        type: Sequelize.JSONB
      },
      deliveryInfo: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stores');
  }
};