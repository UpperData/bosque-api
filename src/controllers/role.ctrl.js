const model=require('../db/models/index');
const { Op } = require("sequelize");

async function getRole(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un role
        return await model.role.findOne({
            where:{id}
        }).then(async function(rsRole){
            if(rsRole){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsRole}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe grupo con este código"}});            
            }
            
        }).catch(async function(errror){
            console.log(error)
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.role.findAll({order:['name']}).then(async function(rsRole){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsRole}});        
        }).catch(async function(errror){
            console.log(error)
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
    
}
async function createRole(req,res){ 
    const{name,isActived,icon}=req.body;
    const t = await model.sequelize.transaction();
    const idRole=await model.role.findOne({
        attributes:[
            [model.sequelize.fn('max', model.sequelize.col('id')), 'max_id']]
    });
    return await model.role.create({id:idRole.dataValues.max_id+1,name,isActived:true,icon},{transaction:t}).then(async function(rsRole){
        const allPermission= await model.permission.findAll({attributes:['id']});
        for (let index = 0; index < allPermission.length; index++) {
            await model.grantRole.findAndCountAll({where:{roleId:rsRole.id,permissionId:allPermission[index].id}}).
            then(async function(rsFindGrant){
                if(rsFindGrant.count<=0){
                    await model.grantRole.create({roleId:rsRole.id,permissionId:allPermission[index].id,isActived:false},{transaction:t})
                }
            }).catch(async function(error){
                console.log(error);        
                t.rollback();
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal registrando grupo"}});  
            })
            
        }                    
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsRole}});      
    }).catch(async function(error){
        console.log(error);        
        t.rollback();
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal registrando grupo"}});  
    })
}
async function editRole(req,res){
    const{id,name,isActived,icon}=req.body;
    const t = await model.sequelize.transaction();
    return await model.role.update({name,isActived,icon},{where:{id}},{transaction:t}).then(async function(rsRole){
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsRole}});      
    }).catch(async function(error){
        t.rollback();
        console.log(error)
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando grupo"}});  
    })
}

module.exports={getRole,createRole,editRole}

