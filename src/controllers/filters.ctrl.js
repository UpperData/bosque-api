const model=require('../db/models/index');

async function getYears(req,res){
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    const {id}=req.params;
    if(id!='*'){
        await model.autoYear.findOne({
            where:{id}
        }).then(async function(rsResult){
            if(rsResult){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los años
        return await model.autoYear.findAll({order:[['name','DESC']]}).then(async function(rsResult){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function getBrands (req,res){
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    const {id}=req.params;
    if(id!='*'){
        await model.brand.findOne({
            where:{id}
        }).then(async function(rsResult){
            if(rsResult){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos las marcas
        return await model.brand.findAll({order:[['name','DESC']]}).then(async function(rsResult){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function getModels (req,res){
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    const {brandId}=req.params;
    if(brandId!='*'){
        await model.brandId.findOne({
            where:{id}
        }).then(async function(rsResult){
            if(rsResult){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos modelos de las marcas
        return await model.model.findAll({order:[['name','DESC']]}).then(async function(rsResult){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsResult}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
module.exports={
    getYears, //obtiene años
    getBrands, //obtiene marcas
    getModels, //obtiene modelos
    
}