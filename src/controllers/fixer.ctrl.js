const model=require('../db/models/index');
const { Op } = require("sequelize");

async function fixerPermissions(req,res){
   
    let created=0;
    let updated=0;
    await model.role.findAll().then(async function(rsRole){        
        for (let index = 0; index < rsRole.length; index++) { // recorre todos lo roles   
            let t = await model.sequelize.transaction();         
            if(rsRole[index].id!=5){
                await model.permission.findAll().then(async function(rsPermission){ //recorre permisos 
                    for (let j = 0; j < rsPermission.length; j++) {                       
                        try{
                            await model.grantRole.create({roleId:rsRole[index].id,permissionId:rsPermission[j].id,isActived:false},{transaction:t})
                            created++;
                        }catch(error){
                            console.log("Role:",rsRole[index].id,"Permision:",rsPermission[j].id);
                            
                                console.log("Actualizando");
                                await model.grantRole.update({roleId:rsRole[index].id,permissionId:rsPermission[j].id,isActived:false},
                                    {where:{roleId:rsRole[index].id,permissionId:rsPermission[j].id}},{transaction:t})
                                    updated++;                                                
                                //console.log(error.name);                                                           
                                //res.status(403).json({data:{"result":false,"message":error.message}});
                                //res.end();
                            
                        }                                         
                    }
                })
            }
            t.commit();
            t=null;
        }
        
        res.status(200).json({data:{"result":true,"message":"Reparación exitosa","data":{"creados":created,"Actualizados":updated}}});
    })/*.catch(async function(error){
        t.rollback();
        console.log(error);
        res.status(403).json({data:{"result":false,"message":error.message}});
    })*/
}

module.exports={fixerPermissions};