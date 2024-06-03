const model=require('../db/models/index');
const { Op } = require("sequelize");

async function getModule(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un modulo
        return await model.module.findOne({
            where:{id}
        }).then(async function(rsModule){
            if(rsModule){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsModule}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.module.findAll({order:['name']}).then(async function(rsModule){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsModule}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
    
}

async function createModule(req,res){ 
    const{name,route,isActived,sorting,icon,description}=req.body;
    const t = await model.sequelize.transaction();
    return await model.module.create({name,isActived,route,sorting,icon,description},{transaction:t}).then(async function(rsModule){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsModule}});      
    }).catch(async function(error){  
        t.rollback()            
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
async function editModule(req,res){
    
    const{id,name,route,isActived,sorting,icon,description}=req.body;
    const t = await model.sequelize.transaction();
    return await model.module.update({id,name,route,isActived,sorting,icon,},{where:{id}},{transaction:t}).then(async function(rsModule){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsModule}});      
    }).catch(async function(error){
        t.rollback();        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando registro"}});  
    })
}
async function subModuleFromModule(req,res){ // Optiene los sub modulos de un modulos
    const {id}=req.params;
    return await model.module.findAll({
        attributes:[['id','moduleId'],'name'],
        where:{id},
        include:[
            {
                model:model.subModule,
                attributes:[['id','subModuleId'],'name']
            }
        ]    
    }).then(async function(rsModule){
        res.status(200).json({"data":{"result":true,"message":"Busqueda Satisfactoria","data":rsModule}});      
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});  
    })
}
module.exports={getModule,createModule,editModule,subModuleFromModule}
