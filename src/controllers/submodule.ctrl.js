const model=require('../db/models/index');
const { Op } = require("sequelize");

async function getSubModule(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un modulo
        return await model.subModule.findOne({
            where:{id},
            include:[{
                model:model.module,
                attributes:['isActived','name']
            }]
        }).then(async function(rsSubModule){
            if(rsSubModule){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsSubModule}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.subModule.findAll(            
            {
            include:[{
                model:model.module,
                attributes:['isActived','name']
            }],
           order:['name']}).then(async function(rsSubModule){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsSubModule}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function createSubModule(req,res){ 
    const{name,route,isActived,sorting,moduleId,description}=req.body;
    const t = await model.sequelize.transaction();
    return await model.subModule.create({name,isActived,route,sorting,moduleId,description},{transaction:t}).then(async function(rsSubModule){
        await model.operation.findAll().then(async function(rsOperations){ 
            for (let index = 0; index < rsOperations.length; index++) {
                //crea permisos
                await model.permission.create({subModuleId:rsSubModule.id,operationId:rsOperations[index].id,isActived:true},{transaction:t})
                .then(async function(rsPermission){
                    // asigna permisos a todos los roles en false
                    await model.role.findAll({atrributes:['id']}).then(async function(rsRole){ 
                        for (let j = 0; j < rsRole.length; j++) {
                            await model.grantRole.create({roleId:rsRole[j].id,permissionId:rsPermission.id,isActived:true},{transaction:t})                            
                        }
                    })
                });
                
            }   
            t.commit();     
            res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsSubModule}});      
        })
    }).catch(async function(error){  
        t.rollback();
        console.log(error)      
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
async function editSubModule(req,res){
    const{id,name,route,isActived,sorting,moduleId,description}=req.body;
    const t = await model.sequelize.transaction();
    return await model.subModule.update({name,route,isActived,sorting,moduleId,description},{where:{id}},{transaction:t}).then(async function(rsSubModule){
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsSubModule}});      
    }).catch(async function(error){
        t.rollback();        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando registro"}});  
    })
}
async function getPermissionBySubModule(req,res){
    const{subModuleId}=req.params;
    await model.subModule.findAll({
        attributes:[['id','subModuleId'],'name'],   
        where:{id:subModuleId},     
        include:[
            {
                model:model.permission,
                attributes:[['id','permissionId'],'operationId'],
               
                include:[
                    {
                        model:model.operation,
                        attributes:[['id','operationId'],'name']
                    }
                ]
            }
        ]
    }).then(async function(rsSubModule){
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsSubModule}});  
    }).catch(async function(error){           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});  
    })
}
module.exports={getSubModule,createSubModule,editSubModule,getPermissionBySubModule}
