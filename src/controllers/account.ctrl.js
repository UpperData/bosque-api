
const model=require('../db/models/index');
const utils = require('./utils.ctrl');
const serviceToken=require('./serviceToken.ctrl');
const roleAccount=require('./accountRoles.ctrl');
const bcrypt=require("bcryptjs"); // encripta caracteres
var crypto = require("crypto"); // valor aleatorio
const { Op } = require("sequelize");
require ('dotenv').config();
async function registerAccount(req,res){
    const {email,people,memberships,photo,phone}=req.body      
      //general password 8 digitos
    var now=new Date();                  
    //let pass= crypto.randomBytes(4).toString('hex')+now.getTime();
    //pass = pass.slice(-6);
    let pass=people.document.numbre.toString()
    //genera username
    let name
    var aleatorio=crypto.randomBytes(8).toString('hex')+now.getTime();    
    name=aleatorio.slice(0,2)+people.document.lastName+aleatorio.slice(aleatorio.length-3,aleatorio.length);       
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const t = await model.sequelize.transaction();  
    let audit=[]
    audit.push({"people":dataToken.people});
    audit.push({"account":dataToken.account});
            
    // Optiene todos los administradores del sistema (email)     
    await model.account.create( {email,photo,phone,name,pass,people,creater:audit,secret:null, token:"null",isConfimr:true,isActived:true},{transaction:t})
    .then(async function(rsAccount){   
        
        // asocia a perosna si existe con el mismo correo
        let existPeople=await model.employeeFile.findAndCountAll({attributes:['id'],where:{email}});        
        if(existPeople.count>0){
            await model.employeeFile.update({accountId:rsAccount.id},{where:{id:existPeople.rows[0].id}},{transaction:t})
        }
         //aplica membresías 
         if(memberships){
            for (let index = 0; index < memberships.length; index++) {
                await model.accountRole.create({roleId:memberships[index],accountId:rsAccount.id,isActived:true},{transaction:t});
             }
         }
         
        //Fin aplica membresias
        await model.accountRole.findAll({
            attributes:['id','accountId','roleId'],
            where:{roleId:5}
            }).then (async function(rsAccountRole){
                for (let index = 0; index < rsAccountRole.length; index++) {
                    
                    if(dataToken.people){
                        await model.notification.create({ 
                            from:process.env.EMAIL_ADMIN,
                            body:{
                                subject:"Cuenta" + process.env.COMPANY + "creada",
                                text:dataToken.people.firstName+" "+dataToken.people.lastName + " ha creado una nueva cuenta de usuario con el nombre "+rsAccount.name+"("+rsAccount.id+")",
                                title:"Nueva cuenta" + process.env.COMPANY + "creada satisfactoriamente",
                                subtitle:rsAccount.name+"("+rsAccount.id+")",
                               // link:"http://"+process.env.HOST_FRONT+"/account/details/"+rsAccount.id
                                },
                            read:false,
                            accountId:rsAccountRole[index].accountId
                        })
                    }
                    
                }                
            }).then(async function(rsNotification){       
                 //envia notificaión al usuario                
               // if(await utils.isInternetConnect()){ //valida conexion a internet
               t.commit();
               res.status(200).json({"data":{"result":true,"message":"Cuenta de usuario registrada satisfactoriamente"}});
                   /* const urlLogin=process.env.HOST_FRONT+"/login";                    
                    var sendMail= await utils.sendMail({ // Notifica al nuevo usuario
                        from:process.env.COMPANY+"<" + process.env.EMAIL_MANAGER +	'>',
                        to:rsAccount.email,
                        subject:"Cuenta Creada",
                        text:"para iniciar su sesión en "+process.env.COMPANY+" haga click en el enlace, su password es: "+ pass,
                        title:"Ya eres usuario de "+process.env.COMPANY,
                        subtitle:null,                
                        action:urlLogin,
                        actionLabel:"Iniciar Sesión"
                    });
                    if(sendMail){
                        res.status(200).json({"data":{"result":true,"message":"Cuenta de usuario registrada satisfactoriamente"}});
                    }else{
                        res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando cuenta de usuario, intente nuevamente"}}); 
                    }
                    let adminEmail=await model.account.findAll({ //busca lista de email de administradores del sistemas
                        attributes:['email'],
                        include:[{
                            model:model.accountRole,
                            atributtes:['id'],
                            where:{roleId:5}
                        }]
                    })
                    let allAdminEmail
                    for (let index = 0; index < adminEmail.length; index++) {
                        if(allAdminEmail!=null){
                            allAdminEmail = allAdminEmail +","+ adminEmail[index].dataValues.email;
                        }else{
                            allAdminEmail=adminEmail[index].dataValues.email;
                        }
                    }             
                    // envia email a administrador                   
                    const tokenProfeile=null;
                    const urlProfile=process.env.HOST_FRONT+"/profile/"+tokenProfeile;                  
                   
                    await utils.sendMail({
                        from:process.env.COMPANY+"<" + process.env.EMAIL_MANAGER +	'>',
                        to:allAdminEmail,
                        subject:"Nuevo usuario creado",
                        //text:dataToken.people.firstName+" "+dataToken.people.lastName + " ha creado una nueva cuenta de usuario con el nombre "+rsAccount.email+"("+rsAccount.id+")",
                        text:"Se ha creado una nueva cuenta de usuario con el nombre "+rsAccount.email+"("+rsAccount.id+")",
                        title:"Nueva cuenta "+process.env.COMPANY+" creada satisfactoriamente",
                        subtitle:rsAccount.name+"("+rsAccount.id+")",
                        action:urlProfile,                                       
                        actionLabel:'Ver Detalles'
                    });   */                
                /*}else{
                    res.status(403).json({"data":{"result":false,"message":"No hay conexión a Internet"}});       
                }  */                            
            }).catch(async function(error){
                console.log(error);               
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando cuenta de usuario"}});         
            })
            
    }).catch(async function(error){        
        console.log(error);
        if(error.name=='SequelizeUniqueConstraintError'){
            res.status(403).json({"data":{"result":false,"message":error.parent.detail}})	    
        }else{
            res.status(403).json({"data":{"result":false,"message":"Algo salio mal procesando registro:"+error,"code":"P006"}})	
        }
        
    })

}
async function loginAccount(req,res){ 
    const{nick,pass}=req.body;
   
    let  email=null;
    let phone=null;
    let dateTime=new Date();    
    if(await utils.validMail(nick)){
        email=nick;
    }else{
        phone=nick;
    }
    
    return await model.account.findOne({       
        where: {
            [Op.or]:{
				phone,
				email,
			},
        },
        include:[
            {
                model:model.employeeFile,
                required:false,
                attributes:['photo']
            }
        ]        
        })
        .then(async function (rsUser){	
            if(rsUser){              
                                
                if(!rsUser.isActived){
                    res.status(403).json({"data":{"result":false,"message":"Usuario Bloqueado, comuniquese con el administrador del sistema"}})        
                }else{
                    if(rsUser.tries>5){                        
                        await model.account.update({isActived:false,hashConfirm:null},{where:{id:rsUser.id}}).then(async function(rsStatus){ //Actualiza status                               
                            role= await roleAccount.getRoleByAccount({accountId:rsUser.id});  
                            await model.notification.create({ 
                                from:process.env.COMPANY,                                
                                body:{
                                    subject:"Cuenta "+process.env.COMPANY+" Bloqueada",
                                    text:"La cuenta"+ rsUser.email+"("+rsUser.id+")" +" ha sido bloqueada por exceso de intentos ",
                                    title:"Cuenta Bloqueada",
                                    subtitle:rsUser.name+"("+rsUser.id+")",
                                    link:process.env.COMPANY+"/account/details/"+rsUser.id
                                    },
                                read:false,
                                accountRolesId:role[0]
                            }) 
                            res.status(403).json({"data":{"result":false,"message":"su cuenta a sido bloqueda por exceder limite de intentos"}}) 
                        }).catch(async function(error){
                            res.status(403).json({data:{"result":false,"message":"Algo salió mal actualizando cuenta de usuario"}});        
                        })                        
                    }else{
                       /* return await  bcrypt.compare(pass,rsUser.pass)//////
                        .then(async  function (rsPass){////////
                            if(rsPass){	//////		*/				
                                return  await roleAccount.getRoleByAccount({accountId:rsUser.id})  
                                .then(async function (rsAccRoles){
                                    if(rsAccRoles.length>0){
                                        var tokenRole
                                        var allRole  = [];
                                        for (let i=0; i<rsAccRoles.length; i++){
                                            allRole.push({"id":rsAccRoles[i]['role'].id,"name":rsAccRoles[i]['role'].name});
                                        }								
                                        dataAccount={"id":rsUser.id,"name":rsUser.name,"email":rsUser.email} //Datos de la cuenta	
                                        dataPeople=rsUser.people;                                        
                                        //let dataStore =await model.store.findOne({where:{accountId:rsUser.id}});                                        
                                        let dataStore={"id":1}
                                        var token =  await serviceToken.newToken(dataAccount,allRole,'login',dateTime,dataPeople,dataStore) //generar Token 
                                       
                                        if(rsUser['employeeFiles'].length>0) {
                                            if(rsUser['employeeFiles'].photo) dataPeople.photo=rsUser['employeeFiles'].photo
                                        };									
                                        await model.account.update({tries:0},{where:{id:rsUser.id}}).then(async function(rsNewPassword){ //Actualiza tries
                                            res.status(200).json({data:{"result":true,"message":"Usted a iniciado sesión " + rsUser.email ,"token":token,tokenRole,"people":dataPeople,"account":dataAccount,"role":allRole}});        
                                        }).catch(async function(error){                        
                                            res.status(200).json({data:{"result":true,"message":"Usted a iniciado sesión " + rsUser.email ,"token":token,tokenRole,"people":dataPeople,"account":dataAccount,"role":allRole,"advertencia":"ocurrio un error intentando actualizar número de intentos"}});        
                                        }) 
                                    }
                                    else{				
                                        res.status(403).json({data:{"result":false,"message":"Usuario no esta activo en un grupo"}});
                                    }
                                })/*	
                            }else {
                                await model.account.update({tries:rsUser.tries+1},{where:{id:rsUser.id}}).then(async function(rsNewPassword){ //Actualiza tries
                                    intento=6-(rsUser.tries+1)
                                    res.status(403).json({"data":{"result":false,"message":"Contraseña inválida, le restan " + intento +" intentos"}})        
                                }).catch(async function(error){                        
                                    res.status(403).json({data:{"result":false,"message":"Contraseña inválida, Algo salió mal actualizando cuenta de usuario"}});        
                                })				
                                
                            }
                        })*/
                    }
                }
                
				
			}
			else {
				res.status(403).json({data:{"result":false,"message":"Usuario no registrado"}});
			}			
        }).catch(async function(error){                        
            console.log(error);
            res.status(403).json({data:{"result":false,"message":" Algo salió mal, Intente nuenvamente"}});        
        })
}
async function passwordRestart(req,res){
    const {token,newPassword,email,secret}=req.body; 
    
    return await model.account.findOne({
        attributes:['id','hashConfirm','secret','email','tries'],
        where:{email}}) // valida si existe cuenta
    .then(async function(rsAccount){  
      
       if(rsAccount){//Valida que no pase de 5 intentos
            if(rsAccount.tries<6){//Valida que no pase de 5 intentos
                if(rsAccount.hashConfirm===token){//valida si el token es correcto
                    //valida respuestas secretas
                    var secretValid=[];
                    var answerValid=false;
                    for (let index = 0; index < rsAccount.secret.length; index++) {  
                        console.log(rsAccount.secret[index].answer);                                             
                        if(await bcrypt.compare(secret[index],rsAccount.secret[index].answer) ){
                            secretValid[index]=true;
                        }else{
                            secretValid[index]=false;
                        }     
                    }
                    function validos(secretValid) {
                        return secretValid == true;
                      }                  
                    if(secretValid.filter(validos).length==rsAccount.secret.length){
                        answerValid=true;
                    } else{
                        answerValid=false;
                    }
                    if(answerValid){//valida respuesta secreta es correcto
                        await model.account.update({pass:newPassword,hashConfirm:null,tries:0},{where:{id:rsAccount.id}}).then(async function(rsNewPassword){ //Actualiza password
                            res.status(200).json({data:{"result":true,"message":"Password actualizado satisfactoriamente"}});        
                        }).catch(async function(error){                        
                            res.status(403).json({data:{"result":false,"message":"Algo salió mal actualizando password"}});        
                        })
                    }else{//valida respuesta secreta es invalida
                        await model.account.update({tries:rsAccount.tries+1},{where:{id:rsAccount.id}}); 
                        intento=6-(rsAccount.tries+1)   
                        res.status(403).json({data:{"result":false,"message":"Respuesta secreta invalida, le quedan "+ intento +" intentos"}});                    
                    }
                }else{
                    await model.account.update({tries:rsAccount.tries+1},{where:{id:rsAccount.id}});
                    intento=6-(rsAccount.tries+1)   
                    res.status(403).json({data:{"result":false,"message":"Token de restauración no valido, debe comunicarse con el administrador del sistema, le quedan"+ intento + " intentos"}});                
                }
            }else{
                await model.account.update({isActived:false},{where:{id:rsAccount.id}});
                res.status(403).json({data:{"result":false,"message":"Cuenta bloqueda por limite de intentos, debe comunicarse con el administrador del sistema"}});   
            }
       }else{        
        res.status(403).json({data:{"result":false,"message":"Cuenta invalida"}});   
    }
        
    }).catch(async function(error){  
        console.log(error);      
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando cuenta de usuario"}});
    })
}
async function passwordUpdate(req,res){
    //opteiner id de cuenta actual
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    const t = await model.sequelize.transaction();    
    const {newPassword,currentPassword}=req.body; 
    
    await model.account.findOne({attributes:['pass','email'],where:{id:dataToken['account'].id}}).then(async function(rsAccount){        
        await  bcrypt.compare(currentPassword,rsAccount.pass).then(async function(rsValid){
            if(rsValid){
                return await model.account.update({pass:newPassword},{where:{id:dataToken.account.id}},{transaction:t}).then(async function(rsNewPassword){ //Actualiza password                    
                    /* const urlRestore=process.env.HOST_FRONT+"/login" 
                    var sendMail= await utils.sendMail({
                        from:"CEMA OnLine <" + process.env.EMAIL_MANAGER +	'>',
                        to:rsAccount.email,
                        subject:"Cambio de Password",
                        text:"Se proceso satisfactoriamente el cambio del password de su cuenta CEMA OnLine",
                        title:"A cambiado el password de su cuenta",
                        subtitle:null,                
                        action:urlRestore,
                        actionLabel:"Iniciar Sesión"
                    }); */
                    //if(sendMail){
                        t.commit();
                        res.status(200).json({data:{"result":true,"message":"Password actualizado satisfactoriamente"}});    
                    /* }else{
                        res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando su solicitud, intente nuevamente"}});       
                    }   */                        
                }).catch(async function(error){ 
                    console.log(error);                                       
                    t.rollback();
                    res.status(403).json({data:{"result":false,"message":error.message}});        
                })
            }else{        
                res.status(200).json({data:{"result":false,"message":"Password actual incorrecto"}});  
            }
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando cambio de password"}});  
        })
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando cuenta de usuario"}});  
    })
}
async function validateEmail(req,res){ // valida exitencia de email
    const {email}= req.params;
    return await model.account.findOne({
        attributes:['id','email','isActived'],
        where:{email}
    }).then(async function(rsAccount){
        if(rsAccount){
            if(rsAccount.isActived){
                res.status(200).json({data:{"result":true,"message":"Correo electrónico (Email) valido","data":rsAccount.email}});
            }else{
                res.status(403).json({data:{"result":false,"message":"Cuenta bloqueada comuniquese con el administrador del sistema"}});        
            }            
        }else{
            res.status(403).json({data:{"result":false,"message":"Correo electrónico (Email) no es valido"}});        
        }        
    }).catch(async function(error){
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando correo electrónico (Email)"}});        
    })
}
async function getSecret(req,res){
    const {email}= req.params;
    return await model.account.findOne({
        attributes:['secret','isActived'],
        where:{email}
    }).then(async function(rsAccount){
        if(rsAccount){
            if(rsAccount.isActived){
                //const resume = {language: null};
                const secreto = !!rsAccount.secret.length; // valida arreglo vacio
                if(secreto){                    
                    let question=[];
                    for (let index = 0; index < rsAccount.secret.length; index++) {                        
                        question.push(rsAccount['secret'][index].question);                       
                    }                    
                    res.status(200).json({data:{"result":true,"message":"Preguntas secretas retornadas con éxito","data":question}});
                }else{
                    res.status(403).json({data:{"result":false,"message":"Usuario no ha configurado sus preguntas secretas, debe comunicarse con el administrador del sistema"}});                
                }                
            }else{
                res.status(403).json({data:{"result":false,"message":"Cuenta bloqueada comuniquese con el administrador del sistema"}});        
            }             
        }else{
            res.status(403).json({data:{"result":false,"message":"Cuenta de usuario no registrada"}});        
        }        
    }).catch(async function(error){   
        console.log(error);     
        res.status(403).json({data:{"result":false,"message":"Algo salió mal obteniendo preguntas secretas"}});        
    })
}
async function restoreSecret(req,res){
    const {email}= req.params;
    console.log(email)
    return await model.account.findOne({
        attributes:['id','email','isActived'],
        where:{email}
    }).then(async function(rsAccount){
        if(rsAccount){
            if(rsAccount.isActived){
                //Genera token 
                const token = await serviceToken.genRestoreSecret({account:{"id":rsAccount.id,"email":rsAccount.email,"name":rsAccount.name}});
               // console.log(token);
                //generar link de restauración
                const urlRestore=process.env.HOST_BACK+"/go/validate/SeCRE/toKEN/" +token
                //rsAccount.email+=',centroespecialidadesmadriz@gmail.com,arcangel272002@gmail.com';
                
                var sendMail= await utils.sendMail({
                    from:process.env.COMPANY +" <" + process.env.EMAIL_MANAGER +	'>',
                    to:rsAccount.email,
                    subject:"Actualización de respuestas",
                    text:"Para continuar el proceso haga click en el link e ingrese lo datos solicitados",
                    title:"Actualización de respuestas secretas",
                    subtitle:null,                
                    action:urlRestore,
                    actionLabel:"Actualizar Respuestas Secretas"
                });
                if(sendMail){
                    res.status(200).json({data:{"result":true,"message":"Ingrese a su correo electrónico para continuar el proceso"}});    
                }else{
                    res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando su solicitud, intente nuevamente"}});       
                }    
            }else{
                res.status(403).json({data:{"result":false,"message":"Cuenta bloqueada comuniquese con el administrador del sistema"}});        
            }            
        }else{
            res.status(403).json({data:{"result":false,"message":"Correo electrónico (Email) no es valido"}});        
        }        
    }).catch(async function(error){       
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando correo electrónico (Email)"}});        
    })
}
async function resetSecretAnswer(req,res){
    const {token}=req.params; // recine token
    const dataToken=serviceToken.getTokenAll(token);//Optiene valores del token
    // valida que exista cuenta
    console.log(dataToken);
    if(dataToken.payload.exp<=moment().unix()){ // Valida expiración                      
        res.redirect(process.env.HOST_FRONT+"idetificationError?message="+"Su token a expirado, debe generar uno nuevo");
    }else { 
        await model.Account.findOne({where:{id:dataToken.payload['account'].id}})
        .then(async function (rsAccount){
            if(!rsAccount.isActived){
                res.status(403).json({data:{"result":false,"message":"Cuenta inactiva"}})
                
            }else{	
                //await model.Account.update({hashConfirm:null}, {where:{id:payload.account,statusId:1}})
                res.redirect(process.env.HOST_FRONT+"resetSecret?token="+token);				
            }	
        }).catch(async function(error){
            console.log(error);            
            res.redirect(process.env.HOST_FRONT+"idetificationError?message="+"Algo slaió mal validando su identidad");
        })
    }

}

async function updateSecret(req,res){
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const{currentPassword}= req.body;
    const {secret}=req.body;
    
    const t = await model.sequelize.transaction();  
    secretCryp=[]
    for (let index = 0; index < secret.length; index++) {
        secret[index].answer =  bcrypt.hashSync(secret[index].answer, 10 );                            
    }
    console.log(secret);
    await model.account.update({secret}, {where:{id:dataToken['account'].id}},{transaction:t})
    .then(async function(rsaccountUd){                        
        t.commit();
        res.status(200).json({data:{"result":true,"message":"Respuestas secretas actualizadas satisfactoriamente"}});  
     })
    /* if(!dataToken){ // Valida expiración       
        res.status(403).json({data:{"result":false,"message":"Sesion expirada"}});  
    }else { 
        const t = await model.sequelize.transaction();    
        await model.account.findOne({where:{id:dataToken['account'].id}})
        .then(async function (rsAccount){
            await  bcrypt.compare(currentPassword,rsAccount.pass).then(async function(rsValid){ // Valida password
                if(rsValid){
                    if(!rsAccount.isActived){
                        res.status(403).json({data:{"result":false,"message":"La cuenta inactiva"}})
                    }else{	
                        secretCryp=[]
                        for (let index = 0; index < secret.length; index++) {
                            secret[index].answer =  bcrypt.hashSync(secret[index].answer, 10 );                            
                        }
                        await model.account.update({secret}, {where:{id:dataToken['account'].id}},{transaction:t}).then(async function(rsaccountUd){                        
                            t.commit();
                            res.status(200).json({data:{"result":true,"message":"Respuestas secretas actualizadas satisfactoriamente"}});   
                        }).catch(async function(error){
                            console.log(error);
                            t.rollback();
                            res.status(403).json({data:{"result":false,"message":"Algo salió mal actualizando sus respuestas secretas, intente nuevamente"}});   
                        })
                        
                    }	
                }else{
                    res.status(403).json({data:{"result":false,"message":"Password no valido"}});   
                }
            }).catch(async function(error){    
                console.log(error);            
                res.status(403).json({data:{"result":false,"message":"Algo salió mal, intente nuevamente"}});   
            })
        }).catch(async function(error){   
            console.log(error);         
            res.status(403).json({data:{"result":false,"message":"Algo salió mal actualizando sus respuestas secretas, intente nuevamente"}});   
        })
    }
 */
}
async function loginToken(req,res){	
	const {token}= req.params		
	if(!token){
		res.status(403).json({"data":{"result":false,"messaje":"Sesión expirada"}});
	}else{
		try{			
			await serviceToken.dataTokenGet(token)//extrae información del token		
			.then(async function(rsCurrentAccount){	
				if(!rsCurrentAccount){
					res.status(401).json({"data":{"result":false,"messaje":"Sesión expirada"}});
				}else{	
                    if(rsCurrentAccount.type=='login'){
                        const photo=await model.employeeFile.findOne({
                            attributes:['photo'],
                            where:{accountId:rsCurrentAccount.account.id}
                        })
                        console.log(photo);
                        if(photo)rsCurrentAccount.people.photo=photo.photo;
                        
                        res.status(200).json({"data":{
                            "result":true,
                            "message":"Usted a iniciado sesión como "+rsCurrentAccount.account.email,
                            token,
                            "people":rsCurrentAccount.people,
                            "account":rsCurrentAccount.account,
                            "role":rsCurrentAccount.role
                        }});
                    }else{
                        res.status(403).json({"data":{"result":false,"messaje":"Su token no es valido"}});
                    }				
                    						
				}						
			}).catch(async function(error){   
                console.log(error)             
				res.status(403).json({"data":{"result":false,"message":"algo salió mal autenticando"}})
			})	
		}
		catch(error){					
			res.status(403).json({"data":{"result":false,"message":"No se pudo valida su identidad"}})
		}
	}
	
}
async function getProfile(req,res){  //optiene el perfil de un usuario
    const token= req.header('Authorization').replace('Bearer ', '');
    const  currentAccount=await serviceToken.dataTokenGet(token);   
    await model.account.findOne({    
        attributes:[['id','accountId'],'email','name','isConfirmed','photo','people','createdAt','updatedAt'],
        where:{id:currentAccount['account'].id }
    }).then(async function(rsProfile){
        res.status(200).json({"data":{
            "result":true,
            "message":"Proceso satisfatorio",
            "data":rsProfile
        }})
    }).catch(async function(error){
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    })
}
async function getRoleByAccount(req,res){ // OBTIENE ROLES DE CUENTA ACTUAL
	const token= req.header('Authorization').replace('Bearer ', '');
    const  currentAccount=await serviceToken.dataTokenGet(token);  
	return await model.account.findAll({  
        attributes:[['id','accountId']],      
		where:{id:currentAccount['account'].id,isActived:true},
		include:[
			{
			model:model.accountRole,
            attributes:[['id','accountRoleId'],'isActived'],
            include:[
                {
                    model:model.role,
                    attributes:[['id','roleId'],'name'],

                }
            ]
			},
			
		]
	})
	.then(async function(srResult){		
		res.status(200).json({"data":{
            "result":true,
            "message":"Proceso satisfatorio",
            "data":srResult
        }})		
	}).catch(async function(error){		
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});		
	})	
}
async function emailUpdate(req,res){
    //opteiner id de cuenta actual
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    const t = await model.sequelize.transaction();    
    const {newEmail,currentPassword}=req.body; 
    await model.account.findOne({attributes:['pass','email'],where:{id:dataToken['account'].id}}).then(async function(rsAccount){ // valida cuenta
        await  bcrypt.compare(currentPassword,rsAccount.pass).then(async function(rsValid){ // Valida password
            if(rsValid){
                return await model.account.update({email:newEmail,isConfirmed:false},{where:{id:dataToken['account'].id}},{transaction:t}).then(async function(rsNewEmail){ //Actualiza email                    
                    var account={"id":dataToken['account'].id,"email":rsAccount.email};
                    const token = await serviceToken. newToken(account,roles=null,type="updateEmail",dateTime=new Date(),people=null);
                    const urlRestore=process.env.HOST_BACK+"/email/verify/"+token;
                    t.commit(); 
                    
                    /* var sendMail= await utils.sendMail({ // envia email para veridicar cuenta
                        from:"Bosque marino <" + process.env.EMAIL_MANAGER +	'>',
                        to:rsAccount.email,
                        subject:"Cambio de Email",
                        text:"Haga clic en el enlace para certificar el Email ",
                        title:"Cambio de Email satisfactorio",
                        subtitle:null,                
                        action:urlRestore,
                        actionLabel:"Certificar Email"
                    });
                    
                    if(sendMail){ */
                        t.commit(); // actializa email
                        res.status(200).json({data:{"result":true,"message":"Email actualizado"}});    
                    /* }else{
                        res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando su solicitud, intente nuevamente"}});       
                    }  */  
                            
                }).catch(async function(error){
                    console.log(error)
                    t.rollback();
                    if(error.name=='SequelizeUniqueConstraintError'){                        
                        res.status(403).json({data:{"result":false,"message":"Ya existe una cuenta con este email"}});            
                    }else{
                        res.status(403).json({data:{"result":false,"message":"Algo salió mal actualizando email"}});        
                    }
                    
                })
            }else{
                res.status(403).json({data:{"result":false,"message":"Password actual incorrecto"}});  
            }
        }).catch(async function(error){
            res.status(403).json({data:{"result":false,"message":"Algo salio mal validando información, intente nuevamente"}});  
        })
    }).catch(async function(error){
        res.status(403).json({data:{"result":false,"message":"Algo salio mal validando información, intente nuevamente"}});  
    })
}
async function emailCertificationToken(req,res){ //Genera y envia  token para certificacion de email
    //optiene email
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    if(dataToken){
        //Genera token
        var account={"id":dataToken['account'].id,"email":dataToken['account'].email}
        var token= await serviceToken.newToken(account,roles=null,type=null,dateTime=new Date(),people=null)
        //Envia correa de certifiación
        const urlRestore=process.env.HOST_BACK+"/email/verify/"+token; 
        var sendMail= await utils.sendMail({ 
            from:"CEMA OnLine <" + process.env.EMAIL_MANAGER +	'>',
            to:dataToken['account'].email,
            subject:"Certificación de Email",
            text:"Haga clic en el enlace para certificar su Email ",
            title:"Certificaicón de Email en CEMA Online",
            subtitle:null,                
            action:urlRestore,
            actionLabel:"Certificar Email"
        });
        if(sendMail){           
            res.status(200).json({data:{"result":true,"message":"Operación procesada satisfactoriamente, recibira un Email para certificar el cambio"}});    
        }else{
            res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando su solicitud, intente nuevamente"}});       
        }  
    }else{
        res.status(403).json({data:{"result":false,"message":"Token no valido"}})
    }        
      
}
async function emailVerify(req,res){ //certifica email
    //Decodifica token
    const {token}=req.params;
    const dataToken=await serviceToken.dataTokenGet(token);  
    //Actualiza cuenta isConfirm=true
    const t = await model.sequelize.transaction();
    if(!dataToken){
        res.status(403).json({data:{"result":false,"message":"Token expirado, de reiniciar el proceso de certificación de email"}});  
    }else{
        await model.account.update({isConfirmed:true},{where:{id:dataToken['account'].id},transaction:t}).then(async function(rsAccount){
            const urlRestore=process.env.HOST_FRONT+"/login"; 
            var sendMail= await utils.sendMail({ 
                from:"CEMA OnLine <" + process.env.EMAIL_MANAGER +	'>',
                to:dataToken['account'].email,
                subject:"Certificación de Email",
                text:"Su Email a sido certificado satisfactoriamente ",
                title:"Email certificado en CEMA Online",
                subtitle:null,                
                action:urlRestore,
                actionLabel:"Iniciar Sessión"
            });
            if(sendMail){
                t.commit();
                res.redirect(process.env.HOST_FRONT+"/verify/email?success=true");                
            }else{
                t.rollback();
                res.redirect(process.env.HOST_FRONT+"/verify/email?success=false");                
            }    
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({data:{"result":false,"message":"Algo salió mal procesando su solicitud, intente nuevamente"}});       
        })
    }
}
async function isCertificated(req,res){ // Verifica si un email esta certificado    
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));      
    if(dataToken){
       
        await model.account.findAndCountAll({attributes:['id','isConfirmed'],where:{id:dataToken['account'].id}}).then(async function(rsAccount){
            //console.log(rsAccount);
            if(rsAccount.count>0){
                res.status(200).json({data:{"result":true,"message":"Email certificado"}}); 
            }else{
                res.status(403).json({data:{"result":false,"message":"Tu email no se ha certificado, muchas tareas requieren que su email esté certificado"}})
            }
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({data:{"result":false,"message":"Algo salió mal, intente nuevames"}})
        })
    }else{
        res.status(403).json({data:{"result":false,"message":"Token no valido"}})
    }
}
async function getSecretCurrent(req,res){ // obtiene preguntas secretas del sesion actual
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    if(dataToken){
        return await model.account.findOne({
            attributes:['secret','isActived'],
            where:{id:dataToken['account'].id}
        }).then(async function(rsAccount){
            if(rsAccount){
                if(rsAccount.isActived){
                    if(rsAccount.secret){
                        let question=[];
                        for (let index = 0; index < rsAccount.secret.length; index++) {                        
                            question.push(rsAccount['secret'][index].question);                       
                        }                    
                        res.status(200).json({data:{"result":true,"message":"Preguntas secretas retornadas con éxito","data":question}});
                    }else{
                        res.status(403).json({data:{"result":false,"message":"Debe configurar preguntas secretas para realizar esta operación"}});                
                    }                
                }else{
                    res.status(403).json({data:{"result":false,"message":"Cuenta bloqueada comuniquese con el administrador del sistema"}});        
                }             
            }else{
                res.status(403).json({data:{"result":false,"message":"Cuenta de usuario no registrada"}});        
            }        
        }).catch(async function(error){     
            res.status(403).json({data:{"result":false,"message":"Algo salió mal obteniendo preguntas secretas"}});        
        })
    }else{
        res.status(403).json({data:{"result":false,"message":"Sesión expirada"}});    
    }
    
}
async function getActiveAccount (req,res){
    return await model.account.findAll({attributes:['id','email'], where:{isActived:true}})
        .then(async function(rsAccount){
            res.status(200).json({data:{"result":true,"message":"Busqueda satisfactoria","data":rsAccount}});
        }).catch(async function(error){
            console.log(error);
            res.status(403).json({data:{"result":false,"message":"Algo salió mal, intente nuevamente"}});    
        })
}
async function buyerRegisterAccount(req,res){
    const {email,people,photo}=req.body  
      //general password 8 dogotpd
    var now=new Date();                  
    let pass= crypto.randomBytes(4).toString('hex')+now.getTime();
    pass = pass.slice(-6);      
    //genera username
    let name
    var aleatorio=crypto.randomBytes(8).toString('hex')+now.getTime();    
    name=aleatorio.slice(0,2)+email.slice(0,-12)+aleatorio.slice(aleatorio.length-3,aleatorio.length);           
    const t = await model.sequelize.transaction();  
    let audit=[]
    audit.push({"people":"Usario comprador"});
    audit.push({"account":"Usuario comprador"});
            
    // OPtiene todos los administradores del sistema (email) 
    await model.account.create( {email,name,pass,people,creater:audit,secret:null, token:"null",isConfirmed:true,isActived:true},{transaction:t})
    .then(async function(rsAccount){   
        
        // asocia a perosna si existe con el mismo correo
        let existPeople=await model.employeeFile.findAndCountAll({attributes:['id'],where:{email}});        
        if(existPeople.count>0){
            await model.employeeFile.update({accountId:rsAccount.id},{where:{id:existPeople.rows[0].id}},{transaction:t})
        }
         //aplica membresía de comprador
         await model.accountRole.create({roleId:2,accountId:rsAccount.id,isActived:true},{transaction:t});
        //Fin aplica membresias
        
        //envia notificación a los adminsitradoresd el sistema
        await model.accountRole.findAll({
            attributes:['id'],
            where:{roleId:5}
            }).then (async function(rsAccountRole){
                for (let index = 0; index < rsAccountRole.length; index++) {
                    //console.log(rsAccountRole[index].id);
                   
                    await model.notification.create({ 
                        from:process.env.EMAIL_ADMIN,
                        body:{
                            subject:"Cuenta" + process.env.COMPANY + "creada",
                            text: "ha creado una nueva cuenta de usuario ",
                            title:"Nueva cuenta" + process.env.COMPANY + "creada satisfactoriamente",
                            subtitle:rsAccount.name+"("+rsAccount.id+")",
                            link:"http://"+process.env.HOST_FRONT+"/account/details/"+rsAccount.id
                            },
                        read:false,
                        accountRolesId:rsAccountRole[index].id
                    })
                
                    
                }                
            }).then(async function(rsNotification){       
                 //envia notificaión al usuario                              
               t.commit();
                const urlLogin=process.env.HOST_FRONT+"/login";                    
                var sendMail= await utils.sendMail({ // Notifica al nuevo usuario
                    from:process.env.COMPANY+"<" + process.env.EMAIL_MANAGER +	'>',
                    to:rsAccount.email,
                    subject:"Cuenta Creada",
                    text:"para iniciar su sesión en "+process.env.COMPANY+" haga click en el enlace, su password es: "+ pass,
                    title:"Ya eres usuario de "+process.env.COMPANY,
                    subtitle:null,                
                    action:urlLogin,
                    actionLabel:"Iniciar Sesión"
                });
                if(sendMail){
                    res.status(200).json({"data":{"result":true,"message":"Cuenta de usuario registrada satisfactoriamente"}});
                }else{
                    res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando cuenta de usuario, intente nuevamente"}}); 
                }
                let adminEmail=await model.account.findAll({ //busca lista de email de administradores del sistemas
                    attributes:['email'],
                    include:[{
                        model:model.accountRole,
                        atributtes:['id'],
                        where:{roleId:5}
                    }]
                })
                let allAdminEmail
                for (let index = 0; index < adminEmail.length; index++) {
                    if(allAdminEmail!=null){
                        allAdminEmail = allAdminEmail +","+ adminEmail[index].dataValues.email;
                    }else{
                        allAdminEmail=adminEmail[index].dataValues.email;
                    }
                }             
                // envia email a administrador                   
                const tokenProfeile=null;
                const urlProfile=process.env.HOST_FRONT+"/profile/"+tokenProfeile;                  
                
                await utils.sendMail({
                    from:process.env.COMPANY+"<" + process.env.EMAIL_MANAGER +	'>',
                    to:allAdminEmail,
                    subject:"Nuevo usuario creado",                        
                    text:"Se ha creado una nueva cuenta de usuario con el nombre "+rsAccount.email+"("+rsAccount.id+")",
                    title:"Nueva cuenta "+process.env.COMPANY+" creada satisfactoriamente",
                    subtitle:rsAccount.name+"("+rsAccount.id+")",
                    action:urlProfile,                                       
                    actionLabel:'Ver Detalles'
                });                                                            
            }).catch(async function(error){
                console.log(error);               
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal creando cuenta de usuario"}});         
            })
            
    }).catch(async function(error){        
        console.log(error);
        if(error.name=='SequelizeUniqueConstraintError'){
            res.status(403).json({"data":{"result":false,"message":error.parent.detail}})	    
        }else{
            res.status(403).json({"data":{"result":false,"message":"Algo salio mal procesando registro:"+error,"code":"P006"}})	
        }
        
    })

}
async function validatePhone(req,res){ // valida exitencia de email
    const {phone}= req.params;
    return await model.account.findOne({
        attributes:['id','isActived'],
        where:{phone}
    }).then(async function(rsAccount){
        if(rsAccount){
            if(rsAccount.isActived){
                res.status(200).json({data:{"result":true,"message":"Número de teléfono valido","data":rsAccount.phone}});
            }else{
                res.status(403).json({data:{"result":false,"message":"Cuenta bloqueada comuniquese con el administrador del sistema"}});        
            }            
        }else{
            res.status(403).json({data:{"result":false,"message":"Número de teléfono no es valido"}});        
        }        
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({data:{"result":false,"message":"Algo salió mal validando Número de teléfono"}});        
    })
}
module.exports={
    registerAccount,
    loginAccount,
    passwordRestart,
    passwordUpdate,
    validateEmail,
    getSecret, // obtiene preguntas secretas del usuario actual
    restoreSecret,
    resetSecretAnswer,
    updateSecret,
    loginToken,
    getProfile,
    getRoleByAccount,
    emailUpdate,
    emailCertificationToken, //genera token para veridicar email
    emailVerify, //Certifica email
    isCertificated, // Verifica si un email esta certificado
    getSecretCurrent,// obtiene preguntas secretas del usuario actual
    getActiveAccount,  // retorna cuentas activas
    buyerRegisterAccount, // Regsitra cuenta de comprador
    validatePhone

}