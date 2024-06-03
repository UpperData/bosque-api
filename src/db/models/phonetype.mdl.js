'use strict';
module.exports = (sequelize, DataTypes) => {
  const phoneType = sequelize.define('phoneType', {
    name: {
    	  type:DataTypes.STRING,
        allowNull:false,
        validate:{
        isIn: [['Movil','Hogar','Empresa']],        
        }
 	  },icon:{
      type:DataTypes.STRING
     }
  }, {});
  phoneType.associate = function(models) {
    // associations can be defined here
  };
  return phoneType;
};