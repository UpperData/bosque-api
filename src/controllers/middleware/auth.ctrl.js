var jwt=require('jwt-simple');
var moment=require('moment');
require('dotenv').config();
var autorizedRole=function(roles){    
    try{  
        return async function (req,res,next){
            const authorized=roles;   
            var isValid=false;  
            if(!req.headers.authorization){    
                        
                res.status(403).json({"data":{"result":false,"message":"Usuario no autorizado"}});  

            }else{                
                const token = req.header('Authorization').replace('Bearer ', ''); 
                                  
                if(token){
                    try{ 
                        var payload= await jwt.decode(token,process.env.JWT_SECRET);
                        if(payload){
                            if(payload.exp<=moment().unix()){                                
                                res.status(401).json({"data":{"result":false,"message":"Su sesión a expirado, por favor incie sesión nuevamente"}})
                            }else if(payload.role.length<1){// permiso denegado con token valido                                
                                res.status(403).json({"data":{"result":false,"message":"Su usuario tiene permiso para el realizar esta acción"}})
                            }else if(payload.rem!='lo-veremos-cara-a-cara'){ //No emitido por pampatar posible intento de haker
                                res.status(403).json({"data":{"result":false,"message":"Origen de su identidad no es valido, por favor incice sesión nuevamente"}})                                
                            } else{ 
                                if(authorized[0]=='*'){
                                    isValid=true 
                                }else{
                                    var roleGroups=payload.role
                                    for (var i = 0; i < authorized.length; i++){
                                        for (var j = 0; j < roleGroups.length; j++){
                                            if (authorized[i] == roleGroups[j].id){
                                                isValid=true
                                            }
                                        }
                                    } 
                                }                
                                
                            }  
                            if(!isValid){ // No autorizado ->posible intento de haker
                                //res.redirect(process.env.HOST_FRONT+"expired/error");
                                res.status(403).json({"data":{"result":false,"message":"No tiene autorización para acceder a este modulo"}})  
                            }else{
                                next();
                            }
                        }else{//No emitido por pampartar ->posible intento de haker
                            //res.redirect(process.env.HOST_FRONT+"expired/error");                           
                            res.status(403).json({"data":{"result":false,"message":"Token no valido"}})  
                        }
                    }catch(error){
                       
                       // res.redirect(process.env.HOST_FRONT+"expired/error");  
                       console.log(error);
                        res.status(403).json({"data":{"result":false,"message":"Usuario no autorizado"}});
                    }
                    
                }
            } 
        }
    } catch(error){
        //console.log(error);
        res.status(403).json({"data":{"result":false,"message":"No fue posible validar su identidad"}})
        //res.redirect(process.env.HOST_FRONT+'sign-in/');
    };
 
}
module.exports={autorizedRole}