'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itemLots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lotId: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'lots', shema: 'public' }, key: 'id'
        }
      },
      weight: {
        type: Sequelize.DECIMAL
      },
      conditionId: {
        type: Sequelize.INTEGER,
        references: {
          model: { tableName: 'conditions', shema: 'public' }, key: 'id'
        }
      },
      audit: {
        type: Sequelize.JSONB
      },
      note: {
        type: Sequelize.STRING
      },
      numItem: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('itemLots');
  }
};