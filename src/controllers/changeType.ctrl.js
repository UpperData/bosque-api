const model=require('../db/models/index');
async function getChangeType(req,res){
    const {id}=req.params;
    if(id!='*'){
        //Busca un modulo
        return await model.changeType.findOne({
            where:{id}
        }).then(async function(rsChangeType){
            if(rsChangeType){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsChangeType}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.changeType.findAll({order:[['updatedAt','DESC']]}).then(async function(rsChangeType){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsChangeType}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function getCurrentChangeType(req,res){
    return await model.changeType.findOne({
        attributes:[ [model.sequelize.fn('max', model.sequelize.col('id')), 'id']]
    }).then(async function(rsChangeType){
        if(rsChangeType){
            await model.changeType.findOne({
                where:{id:rsChangeType.id}
            }).then(async function(rsChangeTypeCurrent){
                if(rsChangeTypeCurrent){
                    res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsChangeTypeCurrent}});        
                }else{
                    res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
                }
                
            }).catch(async function(errror){
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
            })                   
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con de tipo de cambio"}});            
        }
        
    }).catch(async function(errror){
        console.log(errror)
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })
}
async function createChangeType(req,res){ 
    const{value}=req.body;
    const t = await model.sequelize.transaction();
    return await model.changeType.create({value},{transaction:t}).then(async function(rsChangeType){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsChangeType}});      
    }).catch(async function(error){  
        t.rollback()  
        console.log(error);        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
module.exports={getCurrentChangeType,getChangeType,createChangeType}