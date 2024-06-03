'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employeeFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fisrtName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      documentId: {
        type: Sequelize.JSONB
      },
      address: {
        type: Sequelize.JSONB
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      cargo: {
        type: Sequelize.JSONB
      },
      accountId: {
        type: Sequelize.INTEGER,
        references:{
          model:{tableName:'accounts',schema:'public'},
          key:'id'
        }
      },
      phone: {
        type: Sequelize.JSONB
      },
      photo: {
        type: Sequelize.TEXT
      },
      digitalDoc: {
        type: Sequelize.TEXT
      },
      observation: {
        type: Sequelize.TEXT
      },
      academic: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      cursos: {
        type: Sequelize.JSONB
      },
      experience: {
        type: Sequelize.JSONB
      },
      contacto: {
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
    await queryInterface.dropTable('employeeFiles');
  }
};