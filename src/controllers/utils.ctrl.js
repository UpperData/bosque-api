var nodemailer = require("nodemailer");
require ('dotenv').config();
var internetAvailable = require("internet-available");
var jwt=require('jwt-simple');
const moment=require('moment');

async function isInternetConnect(){
    return internetAvailable({timeout: 3000,retries: 2}).then(() => {       
        return true
    }).catch(() => {
        return false
    });    
}


async function sendMail(data){ //Envia Correo electronico
   
    if(validMail){
        var transporter = nodemailer.createTransport({
            //GOOGLE SMTP
          // pool: true,
            secure: true,
            host: "repuestosgo.com",
            port: 465,
            //ignoreTLS: false,
            //secure: false,
            auth: {               
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN             
            }
        });
        // Definimos el email
        var mailOptions = {
            
            from: data.from,
            to: data.to,
            subject: data.subject,
            text: data.text,
            "html": `<!doctype html>
						<img src="http://imgfz.com/i/5BROWfs.png" alt="Logo repuestosgo" width="350" height="97" style="display:block; margin-left:auto; margin-right:auto; margin-top: 25px; margin-bottom:25px"> 
						<hr style="width: 420; height: 1; background-color:#223f6b;">
						<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
					
						<div  align="center">
							<h2 style="font-family:sans-serif; color:#ff4338;" >¡`+data.title+`!</h2>
							<br>
                            <p>`+ data.text + ` </p>
                            <p> <a href=`+ data.action + `>` +data.actionLabel+ `</a> </p>
							<p style="font-family:sans-serif; font-size: 19px;" >`+"Si desconoce esta operación comuniquece con "+process.env.EMAIL_SOPORTE+`</p>
							
							<br>
						</div>						                        
							<img src="http://imgfz.com/i/lSWBLi4.png" alt="1-Mv-ZEtq-B3cshj-Qdbt-ILBe-2-F23p-Eo-G8du22-Ej-Xs-BQCv-j-Nj-G9ik-LSTl1-E3-TRXFw-AETM-w1200-h630-p" border="0" alt="Logo cema" width="120" height="120" style="display:block; margin-left:auto; margin-right:auto; margin-top: auto; margin-bottom:auto">
							<br>
							<div  style="margin-left:auto;font-family:sans-serif; margin-right:auto; margin-top:15px; font-size: 11px;">
								<p align="center">	
									<a href="https://repuestosgo.com/quienes-somos/">Quiénes somos</a> | <a href="https://repuestosgo.com/legal/politicas-de-privacidad/">Términos y condiciones</a> | <a href="https://repuestosgo.com/legal/">Términos y condiciones</a> | <a href="https://repuestosgo.com/preguntas-frecuentes/">Preguntas frecuentes</a> 
								</p>					
						
								<p  align="center" >
								info@repuestosgo.com
										Caracas, Distrito Capital, Cosigo postal ****
								</p>
							</div>`	
            
        };
        // Enviamos el email
        return transporter.sendMail(mailOptions)
    }else{
        return false;
    }
    
}
async function validMail(email){ //valida si el formato de un email es valido
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
       return true;
    } else {
        return false;
    }
}

async function getRoleEmail(data){
    let adminEmail=await model.account.findAll({ //busca lista de email de administradores del sistemas
        attributes:['email'],
        include:[{
            model:model.accountRole,
            atributtes:['id'],
            where:{roleId:data.role}
        }]
    })
    let allRoleEmail
    for (let index = 0; index < allRoleEmail.length; index++) {
        if(allRoleEmail!=null){
            allRoleEmail = allRoleEmail +","+ allRoleEmail[index].dataValues.email;
        }else{
            allRoleEmail=allRoleEmail[index].dataValues.email;
        }
    }
    return allRoleEmail; 
}
module.exports={isInternetConnect,sendMail,validMail,getRoleEmail}