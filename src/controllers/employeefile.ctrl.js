const model=require('../db/models/index');
const { Op } = require("sequelize");
async function getEmployeeFile(req,res){
    const {id}=req.params;
    //{"gender": "M", "number": "17450236", "birthday": "1985-05-01T07:21:14.000Z", "civilStatus": {"id": 1, "name": "Casado"}, "nationality": "V"}
    await model.employeeFile.findOne({        
        where:{
            documentId:{
                number:id
            }
        }
    }).then(async function(rsEmployeeFile){
        res.status(200).json({"data":{"result":true,"message":"Busqueda Satisfactorio","data":rsEmployeeFile}});
    }).catch(async function(error){           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    });

}
async function addEmployeeFile(req,res){
    const{fisrtName, lastName,documentId,address,email,cargo,birthdate,
        phone,photo,digitalDoc,observation,academic,cursos,experience,contacto,isActive}=req.body;
    
    if(fisrtName==null || lastName==null || documentId==null ||email==null,cargo==null,phone==null,academic==null,experience==null){
        const t = await model.sequelize.transaction(); 
        const accountFinded=await model.account.findOne({attributes:['id'],where:{email}});         
        let accountId=null;        
        if(accountFinded ){        

            if(accountFinded.id>0){
                accountId=accountFinded.id;
                //Actualiza informacion personal de la cuenta
                let people= {
                    "document":documentId,
                    "firstName":fisrtName,
                    "lastName":lastName,
                    "birthdate":birthdate                     
                }
                await model.account.update({people},{where:{email}},{transaction:t});
            }            
        }
        await model.employeeFile.create({fisrtName, lastName,documentId,address,email,accountId,cargo,
        phone,photo,digitalDoc,observation,academic,cursos,experience,contacto,isActive},{transaction:t}).then(async function(rsEmployeeFile){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Procesado Satisfactoriamente","data":rsEmployeeFile}});
        }).catch(async function(error){
            t.rollback(); 
            console.log(error);           
            if(error.name='SequelizeUniqueConstraintError'){
                console.log(error);
                res.status(403).json({"data":{"result":false,"message":error.message}});    
            }else{
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
            }
        })
    }
    
}
async function editEmployeeFile(req,res){
    const{id,fisrtName, lastName,documentId,address,email,cargo,birthdate,
    phone,photo,digitalDoc,observation,academic,cursos,experience,contacto,isActive}=req.body;   
    const t = await model.sequelize.transaction();  
    const accountFinded=await model.account.findOne({attributes:['id'],where:{email}});            
    let accountId=null;        
    if(accountFinded ){   
        if(accountFinded.id>0){
            accountId=accountFinded.id;
            //Actualiza informacion personal de la cuenta
            let people= {
                "document":documentId,
                "firstName":fisrtName,
                "lastName":lastName,
                "birthdate":birthdate                     
            }
            await model.account.update({people},{where:{email}},{transaction:t});
        }        
    }   
   
    await model.employeeFile.update({fisrtName, lastName,documentId,address,email,cargo,
    phone,photo,digitalDoc,observation,academic,cursos,experience,contacto,accountId,isActive},{where:{id}},{transaction:t}).then(async function(rsEmployeeFile){
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Procesado Satisfactoriamente","data":rsEmployeeFile}});
    }).catch(async function(error){
        t.rollback();
        console.log(error)
        res.status(403).json({"data":{"result":false,"message":error.message}});
    })
    
}
async function getEmployeeFileByStatus(req,res){
    const {status} =req.params;  
    if(status=='*'){
        return await model.employeeFile.findAll({
            attributes:[['id','employeeFileId'],'documentId','accountId','fisrtName','lastName','lastName'],
            include:[
                {
                    model:model.fee,                    
                    attributes:['amount'],
                    where:{isActived:true},
                    required:false
                }
            ]
        }).then(async function(rsEmploye){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfactoria","data":rsEmploye}});
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
        })
    }else{
        return await model.employeeFile.findAll({
            attributes:[['id','employeeFileId'],'documentId','accountId','fisrtName','lastName','lastName'],
            where:{
                isActive:status
            },
            include:[
                {
                    model:model.fee,                    
                    attributes:['amount'],
                    where:{isActived:true},
                    required:false
                }
            ]
        }).then(async function(rsEmploye){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfactoria","data":rsEmploye}});
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
        })
    }
    
}
async function getEmployeeFileByGroups(req,res){
    const {grp} =req.query;  
    return await model.role.findAll({
        attributes:[['id','roleId'],'name','isActived'],
        where:{
            isActived:true,
            id:{
                [Op.or]:[grp]
            }
        },
        include:[{
            model:model.accountRole,
            require:false,
            attributes:[['id','roleAccountId']],
            include:[
                {
                    model:model.account,
                    require:false,
                    attributes:[['id','accountId'],'name','email'],
                    include:[
                        {   
                            model:model.employeeFile,
                            attributes:['id','fisrtName','lastName','documentId'],
                            require:false
                        }
                    ]
                    
                   
                }
            ]
        }]
    }).then(async function(rsEmploye){
        res.status(200).json({"data":{"result":true,"message":"Busqueda satisfactoria","data":rsEmploye}});
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    })
}
async function feeEmployeeUpdate(req,res){
    const {employeeFileId,amount} =req.body;  
    const t = await model.sequelize.transaction();

    return await model.fee.create({amount,employeeFileId,isActived:true},{transaction:t}).then (async function(rsFeeNew){       
        await model.fee.update({isActived:false},{where:{employeeFileId}},{transaction:t}).then (async function(rsFee){            
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Proceso satisfactorio","data":rsFee}});
        }).catch(async function(error){        
            t.rollback();
            res.status(403).json({"data":{"result":false,"message":error.message}});
        })        
    }).catch(async function(error){          
        t.rollback();
        res.status(403).json({"data":{"result":false,"message":error.message}});
    })
     

}

module.exports={getEmployeeFile,addEmployeeFile,editEmployeeFile,getEmployeeFileByGroups,getEmployeeFileByStatus,
    feeEmployeeUpdate
}