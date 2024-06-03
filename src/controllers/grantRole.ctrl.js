const model=require('../db/models/index');

async function addGrantRole(req,res){
    const {roleId,permission}=req.body;   
    const t= await model.sequelize.transaction();
    try{        
        for (let index = 0; index < permission.length; index++) {   
            await model.grantRole.findAndCountAll({
                attributes:['id','permissionId','isActived'],
                where:{roleId,permissionId:permission[index].id}
            }).then(async function(rsGrantRole){               
                console.log(rsGrantRole['rows'][0].id)
                if(rsGrantRole.count==0){
                    await model.grantRole.create({roleId,permissionId:permission[index].id,isActived:permission[index].isActived},{transaction:t})
                }else{
                    await model.grantRole.update({roleId,permissionId:permission[index].id,isActived:permission[index].isActived},
                        {where:{id:rsGrantRole['rows'][0].id}},{transaction:t})
                    }
            });           
        }
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Proceso Satisfactorio"}});
    }catch(error){
        console.log(error);
        t.rollback();        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    

    }    
}
module.exports={addGrantRole}