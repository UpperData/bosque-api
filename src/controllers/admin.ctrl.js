const model=require('../db/models/index');
var crypto = require("crypto"); 
const { Op } = require("sequelize");
const utils = require('./utils.ctrl');
async function passwordResetEnable(req,res){ // hablita el cambio de password
    const {email}=req.params
    const t = await model.sequelize.transaction();  	
    return await model.account.findOne({       
    where: {email},
    }).then(async function (rsUser){	
        if(rsUser){
            //general codigo 4 digitos 
            var now=new Date();                  
            token= crypto.randomBytes(4).toString('hex')+now.getTime();
            token = token.slice(-4);                  
            //var token =  await servToken.newToken(dataAccount,allRole,'passwordReset',dateTime) //generar Token
            await model.account.update({hashConfirm:token},{where:{id:rsUser.id}},{transaction:t})
            .then(async function(rsAccount){                 
                await t.commit();                    
                res.status(200).json({data:{"result":true,"message":"Se autorizó al usuario para restaurar su password","token":token}});
            }).catch(async function (error){
                await t.rollback();
                res.status(403).json({data:{"result":false,"message":"Algo salió mal autorizando cambio de password"}});
            })
        }else{
            await t.rollback();
            res.status(403).json({data:{"result":false,"message":"Usuario no existe"}});
        }
    }).catch(async function(error){
        await t.rollback();
        console.log(error);
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando cuenta de usuario"}});
    })
}
async function activateAccount(req,res){
    const {email}=req.params
    await model.account.update(
        {isActived:true,tries:6} ,
        {where:{email}}).then(async function (rsAcitvteAccount){
            if(await utils.isInternetConnect()){ //valida conexion a internet
                const urlLogin=process.env.HOST_BACK+"/cema/login/";                    
                var sendMail= await utils.sendMail({ // Notifica al nuevo usuario
                    from:"CEMA OnLine <" + process.env.EMAIL_MANAGER +	'>',
                    to:email,
                    subject:"Cuenta Reactiva",
                    text:"Puedes continuar usando el servicio, para iniciar sesión en CEMA OnLine haga click en el enlace ",
                    title:"Tu cuenta CEMA OnLine a sido reactivada ",
                    subtitle:null,                
                    action:urlLogin
                });
                if (sendMail){
                    res.status(200).json({data:{"result":true,"message":"Cuenta reactivada satisfactoriamente"}});
                }else{
                    res.status(200).json({data:{"result":true,"message":"Cuenta reactivada sin notificación de email"}});
                }
            }else{
                res.status(200).json({data:{"result":true,"message":"Cuenta reactivada satisfactoriamente"}});
            }
        
    }).catch(async function(error){        
        res.status(403).json({data:{"result":false,"message":"Algo salió mal reactivando cuenta de usuario"}});
    })
}
async function getAccountWithToken(req,res){
    return await model.account.findAll({
        attributes:['id','name','email','hashConfirm'],
        where:{
            hashConfirm:{[Op.not]:null}
        }       
    }).then(async function(rsAccount){
        res.status(200).json({data:{"result":true,"message":"Busqueda satisfactoria","data":rsAccount}});
    }).catch(async function(error){
        res.status(403).json({data:{"result":false,"message":"Algo salió mal obteniendo registros"}});
    })
}
async function getRoleByAccount(req,res){
	const{accountId}=req.params;
	return await model.accountRole.findAll({ 
        attributes:['id','roleId','isActived'],
		where:{accountId},
		include:[			
			{
                model:model.role,
                attributes:['id','name']
			}
		]
	})
	.then(async function(rsResult){				
        res.status(200).json( { data:{"result":true,"message":"Busqueda satisfactoria","data":rsResult}});				
	}).catch(async function(error){	
        
		res.status(403).json({ data:{"result":false,"message":"Algo salió mal, no se pudo buscar "}})
	})	
}
async function passwordResetRevoke(req,res){ // hablita el cambio de password
    const {id}=req.params
    const t = await model.sequelize.transaction();  	
    return await model.account.findOne({       
    where: {id},
    }).then(async function (rsUser){	
        if(rsUser){        
            await model.account.update({hashConfirm:null},{where:{id:rsUser.id}},{transaction:t})
            .then(async function(rsAccount){                 
                await t.commit();                    
                res.status(200).json({data:{"result":true,"message":"Se deshabilito para restaurar password"}});
            }).catch(async function (error){
                await t.rollback();
                res.status(403).json({data:{"result":false,"message":"Algo salió mal, intente nuevamente"}});
            })
        }else{
            await t.rollback();
            res.status(403).json({data:{"result":false,"message":"Usuario no existe"}});
        }
    }).catch(async function(error){
       // await t.rollback();
        console.log(error);
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando cuenta de usuario"}});
    })
}
module.exports={passwordResetEnable,activateAccount,getAccountWithToken,getRoleByAccount,passwordResetRevoke};