const model=require('../db/models/index');
const { Op } = require("sequelize");

async function getPermission(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un modulo
        return await model.permission.findOne({
            where:{id},
            include:[{
                model:model.subModule,
                attributes:['id','isActived','name']
            },{
                model:model.operation,
                attributes:['id','isActived','name']
            }]
        }).then(async function(rsPermission){
            if(rsPermission){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPermission}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.permission.findAll(            
            {
            include:[{
                model:model.subModule,
                attributes:['id','isActived','name']
            },{
                model:model.operation,
                attributes:['id','isActived','name']
            }],
           order:['id']}).then(async function(rsPermission){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPermission}});        
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getPermisionByGroup(req,res){
    const {roleId}=req.params;
    return await model.grantRole.findAll({where:{roleId}}).then(async function(rsGetPermision){
        await model.permission.findAll(            
            {            
            include:[{
                model:model.subModule,
                attributes:['id','isActived','name']
            },{
                model:model.operation,
                attributes:['id','isActived','name']
            }],
           order:['name']}).then(async function(rsPermission){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPermission}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }).catch(async function(error){        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}}); 
    })    
}  
async function addPermision(req,res){ //regsitra un nuevo permiso
    const{subModuleId,operations}=req.body;    
    const t = await model.sequelize.transaction();
    try{
        for (let index = 0; index < operations.length; index++) {
            var countPermitions= await model.permission.findAndCountAll(                    
                {where:{subModuleId,operationId:operations[index].id}},
                {transaction:t}
            );// valida que no exista el permiso 
            if(countPermitions.count==0){ // si no existe
                await model.permission.create({subModuleId,operationId:operations[index].id,isActived:operations[index].isActived},{transaction:t})
                .then(async function(rsPermissionAdd){
                    // Asigno permiso a todos lo roles en false
                    const allRoles=await model.roles.findAll({attributes:['id','name']});
                    for (let index = 0; index < allRoles.length; index++) {
                        await model.permission.findAndCountAll({where:{roleId:allRoles[index].id,permissionId:rsPermissionAdd.id}})
                        .then(async function(rsFindPermission){
                            if(rsFindPermission.count==0){ // si no existe le permiso lo crea
                                await model.permission.grantRole({roleId:allRoles[index].id,permissionId:rsPermissionAdd.id,isActived:false},{transaction:t})                            
                            }
                            
                        })
                        
                    }                    
                }).catch(async function(error){    
                    console.log(error);     
                    res.status(403).json({"data":{"result":false,"message":"Algo salió registrando permiso"}}); 
                })
                //agregar este permiso en todos los modulos en false
            }                
        }   
        res.status(200).json({"data":{"result":true,"message":"Proceso Satisfactorio"}}); 
        t.commit();              
    }catch(error){
        t.rollback();       
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal procesando registro"}}); 
    } 
}
async function updatePermission(req,res){ //actualiza un permiso
    const{permissionId,subModuleId,operations,isActived}=req.body;       
    const t = await model.sequelize.transaction();
    try{
        for (let index = 0; index < operations.length; index++) {
            var countPermition= await model.permission.findAndCountAll(                    
                {where:{subModuleId,operationId:operations[index].id}},
                {transaction:t}
            );// valida que no exista el permiso 
            //console.log(countPermition.count);
            if(countPermition.count>0){ // siexiste                
                await model.permission.update(
                    {isActived:operations[index].isActived},
                    {where:{id:permissionId}},
                    {transaction:t}
                );
            }                
        } 

        res.status(200).json({"data":{"result":true,"message":"Proceso Satisfactorio"}}); 
        t.commit();  
    }catch(error){
        t.rollback();       
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal procesando registro"}}); 
    } 
}
async function updatePermissionStatus(req,res){ //actualiza estsus de un permiso habilita/deshabilita
    const{permissionId,isActived}=req.body;       
    const t = await model.sequelize.transaction();

    await model.permission.update(
        {isActived},
        {where:{id:permissionId}},
        {transaction:t}
    ).then(async function(rsPermission){
        t.commit();  
        res.status(200).json({"data":{"result":true,"message":"Proceso Satisfactorio"}});         
    }).catch(async function(error){
        t.rollback();       
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal procesando registro"}}); 
    })
}
async function endPermission(req,res){
    const{groupId,moduleId,subModuleId}=req.params;
    await model.grantRole.findAll({
        attributes:[['id','grantRoleId'],'roleId','permissionId','isActived'],
        where:{roleId:groupId},
        include:[
            {
                model:model.permission,
                attributes:[['id','permissionId'],'operationId','subModuleId','isActived'],
                where:{subModuleId},
                include:[
                    {
                        model:model.operation,
                        attributes:[['id','operationId'],'name']
                    },
                    {
                        model:model.subModule,
                        attributes:[['id','subMduleId'],'name','moduleId'],
                        where:{moduleId},
                        include:[
                            {
                                model:model.module,
                                attributes:[['id','moduleId'],'name'],                           
                            }
                        ]
                    }
                ]
            }    
            
        ]
    }).then(async function(rsEndPermission){
        res.status(200).json({"data":{"result":true,"message":"Busqueda Satisfactoria","data":rsEndPermission}}); 
    }).catch(async function(error){
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}}); 
    })
}
module.exports={getPermission,getPermisionByGroup,addPermision,updatePermission,endPermission,updatePermissionStatus}