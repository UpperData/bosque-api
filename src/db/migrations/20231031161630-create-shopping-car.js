'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shoppingCars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        allowNull: false,
        type: Sequelize.INTEGER,        
        references:{
          model:{tableName:'account',shema:'public'},key:'id'
        }
        
      },
      itemLotId: {
        type: Sequelize.JSONB,
        allowNull: false,        
        references:{
          model:{tableName:'itemLot',shema:'public'},key:'id'
        }
      },
      orderSatusId: {
        type: Sequelize.JSONB,
        allowNull: false,
        references:{
          model:{tableName:'orderStatuses',shema:'public'},key:'id'
        }
      },
      dispatch: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      discount:{
        type:Sequelize.STRING
      },
      finalWeigth:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shoppingCars');
  }
};