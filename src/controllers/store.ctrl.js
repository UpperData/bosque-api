
const model=require('../db/models/index');
const utils = require('./utils.ctrl');
const serviceToken=require('./serviceToken.ctrl');
const roleAccount=require('./accountRoles.ctrl');
const bcrypt=require("bcryptjs"); // encripta caracteres
var crypto = require("crypto"); // valor aleatorio
const { Op } = require("sequelize");
//const { token } = require('morgan');
require ('dotenv').config();

async function createStore(req,res){
    //valida campos requeridos
    const  {name,logo,description,isItHaveBuild,phone,address,parroquiaId,
            storeTypeId,isActived,fiscalInfo,deliveryInfo, accountId}=req.body;
    const t = await model.sequelize.transaction();
    await model.store.create({name,logo,description,isItHaveBuild,phone,address,
        parroquiaId,storeTypeId,isActived,fiscalInfo,deliveryInfo,accountId},{transaction:t})
        .then(async function(rsStoreCreate){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Tienda registrada satisfactoriamente"}});
        }).catch(async function(error){
            console.log(error)
            t.rollback();
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando tienda, intente nuevamente"}});
        });
}
async function findStore(req,res){
    const {id}=req.params;
    if(id!='*'){
        //Busca una tienda
        return await model.store.findOne({
            where:{id},
            include:[
                {
                    model:model.parroquia,
                    attributes:['id','name'],
                    include:[{
                        model:model.province,
                        attributes:['id','name'],
                        include:[{
                            model:model.state,
                            attributes:['id','name'],
                        }]
                    }]
                    
                }
                
            ]
        }).then(async function(rsStore){
            if(rsStore){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsStore}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            console.log(errror)
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todas las tiendas
        return await model.store.findAll(
        {
            order:['name'],
            include:[
                {
                    model:model.parroquia,
                    attributes:['id','name'],
                    include:[{
                        model:model.province,
                        attributes:['id','name'],
                        include:[{
                            model:model.state,
                            attributes:['id','name'],
                        }]
                    }]
                    
                }
            ]
        }).then(async function(rsStore){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsStore}});        
        }).catch(async function(errror){
            console.log(errror)
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function updateStore(req,res){
    const  {id,name,logo,description,isItHaveBuild,phone,address,parroquiaId,
            storeTypeId,isActived,fiscalInfo,deliveryInfo}=req.body;
    const t = await model.sequelize.transaction();
    await model.store.update({name,logo,description,isItHaveBuild,phone,address,
        parroquiaId,storeTypeId,isActived,fiscalInfo,deliveryInfo},{where:{id}},{transaction:t})
        .then(async function(rsStoreCreate){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Tienda actualizada satisfactoriamente"}});
        }).catch(async function(error){
            t.rollback();
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando tienda, intente nuevamente"}});
        });
}
async function createContract(req,res){
    //valida campos requeridos
    const  {startDate,endDate,comission,storeId,isActived,fileContract}=req.body;
    const t = await model.sequelize.transaction();
    await model.contract.findAndCountAll({where:{storeId,isActived:true}})
    .then(async function(rsFindContract){
        if(rsFindContract.count>0){
            t.rollback();
            res.status(403).json({"data":{"result":true,"message":"Contrano NO procesado, tienda posee un contrato activo "}});
        }else{
            await model.contract.create({startDate,endDate,comission,storeId,isActived,fileContract},{transaction:t})
            .then(async function(rsResult){            t.commit();
                res.status(200).json({"data":{"result":true,"message":"Contrato registrado satisfactoriamente"}});
            }).catch(async function(error){
                console.log(error)
                t.rollback();
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando contrato, intente nuevamente"}});
            });
        }
    })

}
async function revokeContract(req,res){
    const  {id,isActived}=req.body;
    const t = await model.sequelize.transaction();
    await model.contract.update({isActived},{where:{id}},{transaction:t})
        .then(async function(rsContract){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Contrato actualizado satisfactoriamente"}});
        }).catch(async function(error){
            t.rollback();
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando contrato, intente nuevamente"}});
        });
}
async function contractFile(req,res){
    const  {id,fileContract}=req.body;
    const t = await model.sequelize.transaction();
    await model.contract.update({fileContract},{where:{id}},{transaction:t})
        .then(async function(rsContract){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Contrato actualizado satisfactoriamente"}});
        }).catch(async function(error){
            t.rollback();
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando contrato, intente nuevamente"}});
        });
}
async function findContract(req,res){
    const {id}=req.params;
    if(id!='*'){
        //Busca una tienda
        return await model.contract.findOne({
            where:{id}
        }).then(async function(rsContract){
            if(rsContract){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsContract}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todas las tiendas
        return await model.contract.findAll({order:['createdAt']}).then(async function(rsContract){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsContract}});        
        }).catch(async function(errror){
            console.log(errror)
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function findContractByStore(req,res){
    const {storeId}=req.params;  
    return await model.contract.findAll({where:{storeId}},{order:['createdAt']}).
    then(async function(rsContract){
        res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsContract}});        
    }).catch(async function(errror){
        console.log(errror)
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })
    
}
module.exports={
    createStore, // crea una tienda
    findStore,  //buscar tienda
    updateStore, // actualizar tienda
    createContract, // Crea un contrato
    revokeContract, // Editar contrato
    findContract,  // contrato x id / all
    findContractByStore, // contratos por tienda
    contractFile
}