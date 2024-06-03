'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {    
    await queryInterface.bulkInsert('states', [
     {id:1, name:'Amazonas',createdAt: new Date(),updatedAt: new Date()},
     {id:2, name:'Anzoátegui',createdAt: new Date(),updatedAt: new Date()},
     {id:3, name:'Apure',createdAt: new Date(),updatedAt: new Date()},
     {id:4, name:'Aragua',createdAt: new Date(),updatedAt: new Date()},
     {id:5, name:'Barinas',createdAt: new Date(),updatedAt: new Date()},
     {id:6, name:'Bolívar',createdAt: new Date(),updatedAt: new Date()},
     {id:7, name:'Carabobo',createdAt: new Date(),updatedAt: new Date()},
     {id:8, name:'Cojedes',createdAt: new Date(),updatedAt: new Date()},
     {id:9, name:'Delta Amacuro',createdAt: new Date(),updatedAt: new Date()},
     {id:10, name:'Falcón',createdAt: new Date(),updatedAt: new Date()},
     {id:11, name:'Guárico',createdAt: new Date(),updatedAt: new Date()},
     {id:12, name:'Lara',createdAt: new Date(),updatedAt: new Date()},
     {id:13, name:'Mérida',createdAt: new Date(),updatedAt: new Date()},
     {id:14, name:'Miranda',createdAt: new Date(),updatedAt: new Date()},
     {id:15, name:'Monagas',createdAt: new Date(),updatedAt: new Date()},
     {id:16, name:'Nueva Esparta',createdAt: new Date(),updatedAt: new Date()},
     {id:17, name:'Portuguesa',createdAt: new Date(),updatedAt: new Date()},
     {id:18, name:'Sucre',createdAt: new Date(),updatedAt: new Date()},
     {id:19, name:'Táchira',createdAt: new Date(),updatedAt: new Date()},
     {id:20, name:'Trujillo',createdAt: new Date(),updatedAt: new Date()},
     {id:21, name:'La Guaira',createdAt: new Date(),updatedAt: new Date()},
     {id:22, name:'Yaracuy' ,createdAt: new Date(),updatedAt: new Date()},
     {id:23, name:'Zulia' ,createdAt: new Date(),updatedAt: new Date()},
     {id:24, name:'Distrito Capital',createdAt: new Date(),updatedAt: new Date()},
     {id:25, name:'Dependencias Federales',createdAt: new Date(),updatedAt: new Date()}
   ], {});
 },
 async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('states', null, {});
 }
};
