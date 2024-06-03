const model=require('../db/models/index');

async function getDepartament(req,res){
    const {id}=req.params;
    if(id!='*'){
        //Busca un modulo
        return await model.departament.findOne({
            where:{id}
        }).then(async function(rsDepartament){
            if(rsDepartament){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsDepartament}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }
            
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos los roles
        return await model.departament.findAll({order:['name']}).then(async function(rsDepartament){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsDepartament}});        
        }).catch(async function(errror){
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function createDepartament(req,res){ 
    const{name}=req.body;
    const t = await model.sequelize.transaction();
    return await model.departament.create({name},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsDepartament}});      
    }).catch(async function(error){  
        t.rollback()  
        console.log(error);        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
async function editDepartament(req,res){
    const t = await model.sequelize.transaction();
    const{id,name}=req.body;
    return await model.departament.update({name},{where:{id}},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsDepartament}});      
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando registro"}});  
    })
}
async function createSubDepartament(req,res){ 
    const{departamentId,name}=req.body;
    const t = await model.sequelize.transaction();
    return await model.subDepartament.create({departamentId,name},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsDepartament}});      
    }).catch(async function(error){  
        t.rollback()  
        console.log(error);        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
async function editSubDepartament(req,res){
    const t = await model.sequelize.transaction();
    const{id,name}=req.body;
    return await model.subDepartament.update({name},{where:{id}},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsDepartament}});      
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando registro"}});  
    })
}
async function createCargo(req,res){ 
    const{departamentId,name}=req.body;
    const t = await model.sequelize.transaction();
    const idCargo=await model.cargo.findOne({
        attributes:[
            [model.sequelize.fn('max', model.sequelize.col('id')), 'max_id']]
    });
    return await model.cargo.create({id:idCargo.dataValues.max_id+1,departamentId,name},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Registro Satisfactorio","data":rsDepartament}});      
    }).catch(async function(error){  
        t.rollback()  
        console.log(error);        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando registro"}});  
    })
}
async function editCargo(req,res){
    const t = await model.sequelize.transaction();
    const{id,name}=req.body;
    return await model.cargo.update({name},{where:{id}},{transaction:t}).then(async function(rsDepartament){
        t.commit()
        res.status(200).json({"data":{"result":true,"message":"Actualización Satisfactoria","data":rsDepartament}});      
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal actualizando registro"}});  
    })
}
module.exports={getDepartament,createDepartament,editDepartament,createSubDepartament,editCargo,createCargo,editSubDepartament}