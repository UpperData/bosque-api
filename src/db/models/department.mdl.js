'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class departament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  departament.init({
    name: {
      type:DataTypes.STRING},

    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
      set(value) {
        var proxId= Model.sequelize.query("SELECT max(id) + 1 as proximo from departaments");    
        Model.sequelize.query(`ALTER SEQUENCE departaments_id_seq RESTART WITH ${proxId[0][0].proximo}`);// actualizado 
      }
    }
  }, {
    sequelize,
    modelName: 'departament',
  });
  return departament;
};