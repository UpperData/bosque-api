
const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');

async function appointmentNew(req,res){
    const{
        dateAppointment,hourAppointment,foreignId,siniestroId,address,isOpened,medialPersonal,appointmentTypeId,
        cedula,firstName,lastName,gender,nationality,patientTypeId,phone,birthdate,civil
    }=req.body
    let patientId=null;
    
    await model.patient.findAndCountAll({
        attributes:['id'], 
        where:{
            document:{
                number:cedula
            }
        }
    }).then(async function(rsPatient){        
        const t = await model.sequelize.transaction();
        let document={
            "nationality":nationality,
            "number":cedula,
            "gender":gender ,
            "civil":civil 
        }
        if(rsPatient.count>0){    //exites el paciente  
            //patientId=  rsPatient['rows'][0].id;            
            await model.patient.update({                
                document,
                nombre: firstName,
                apellido: lastName,
                edad:birthdate,                
                phone: phone,
                patientTypeId
            },{where:{id:rsPatient['rows'][0].id}},{transaction:t}).then(async function(rsPatientupdate){
                patientId=rsPatient['rows'][0].id
            }).catch(async function(error){               
                t.rollback()
                res.status(403).json({data:{"result":false,"message":error.message}});
            })
        }
        else{ // registra paciente
            
            await model.patient.create({
                document,
                nombre: firstName,
                apellido: lastName,
                edad:birthdate,                
                phone: phone,
                patientTypeId
            },{transaction:t}).then(async function(rsPatientNew){
                patientId=rsPatientNew.id
            }).catch(async function(error){               
                t.rollback()
                res.status(403).json({data:{"result":false,"message":error.message}});
            })
        }
            await model.appointment.create({dateAppointment,hourAppointment,foreignId,siniestroId,address,isOpened,patientId,medialPersonal,appointmentTypeId},{transaction:t})
            .then(async function(rsAppointment){
                t.commit();
                res.status(200).json({data:{"result":true,"message":"Cita registrada satisfactoriamente"}});
            }).catch(async function(error){
                console.log(error);
                t.rollback()
                res.status(403).json({data:{"result":false,"message":error.message}});
            })
    })
}

async function updateAppointment(req,res){
    const{
        id,dateAppointment,hourAppointment,foreignId,siniestroId,address,isOpened,medialPersonal,appointmentTypeId,
        cedula,firstName,lastName,gender,nationality,patientTypeId,phone,birthdate,patientId,civil
    }=req.body

    document={
        "nationality":nationality,
        "number":cedula,
        "gender":gender,
        "civil":civil 
    }
    const t = await model.sequelize.transaction();
    await model.patient.update({   //Actualiza datos del paciente      
        document,
        nombre: firstName,
        apellido: lastName,
        edad:birthdate,                
        phone: phone,
        patientTypeId
    },{where:{id:patientId}},{transaction:t}).then(async function(rsPatientupdate){       

        await model.appointment.update( // Actualiza la cita si aun esta abierta
            {dateAppointment,hourAppointment,foreignId,siniestroId,address,isOpened,patientId,medialPersonal,appointmentTypeId},{where:{id,isOpened:true}},{transaction:t}
        ).then(async function(rsAppointment){
            
            t.commit();
            res.status(200).json({data:{"result":true,"message":"Cita actualizada satisfactoriamente"}});
        }).catch(async function(error){        
            t.rollback()
            res.status(403).json({data:{"result":false,"message":error.message}});
        })

    }).catch(async function(error){               
        t.rollback()
        res.status(403).json({data:{"result":false,"message":error.message}});
    })
}

async function getAppointment(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca una cita
        return await model.appointment.findOne({            
            where:{id},
            include:[
                {
                    model:model.appointmentType,
                    attributes:[['id','appointmentTypeId'],'name']
                },
                {
                    model:model.patient,
                    include:[
                        {
                            model:model.patientType,
                            attributes:[['id','appointmentTypeId'],'name']
                        }
                    ]
                    
                }
            ]
        }).then(async function(rsAppointmentType){
            if(rsAppointmentType){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsAppointmentType}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existen registros"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todas las citas del mes
        let hoy=new Date();
        //console.log(hoy.getMonth());
        let month=hoy.getMonth()+1;
        let firstDayMont=new Date("2020-"+month+"-01");
        return await model.appointment.findAll({            
            where:{
                createdAt:{
                    [Op.between]:[firstDayMont,hoy]
                }
            },
            include:[
                {
                    model:model.appointmentType,
                    attributes:[['id','appointmentTypeId'],'name']
                },
                {
                    model:model.patient,
                    include:[
                        {
                            model:model.patientType,
                            attributes:[['id','appointmentTypeId'],'name']
                        }
                    ]
                    
                }
            ],
           order:['isOpened']
        }).then(async function(rsAppointmentType){
            if(rsAppointmentType){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsAppointmentType}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){              
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })

    }    
}
async function getAppointmentByDoctor(req,res){    
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    if(dataToken){
        await model.employeeFile.findOne({ // busca la ficha del empleado
            where:{accountId:dataToken['account'].id}
        }).then(async function(rsEmployee){
            await model.patient.findAll(
                {
                    attributes:[['id','patientId'],'nombre','apellido','document'],
                    include:[
                        {
                            model:model.appointment,
                            attributes:[['id','appointmentId']],
                            where:{
                                medialPersonal:{
                                    doctor:{
                                        employeeId:rsEmployee.id
                                        
                                    }
                                },isOpened:true
                            }
                        }
                    ]
                }
            ).then(async function(rsPatient){                
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPatient}});  
            }).catch(async function(error){  
                console.log(error)    
                res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
            })
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })        
    }
}
async function getAppointmentByDate(req,res){    
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    const {dateAppointment} = req.params;
    if(dataToken){
        await model.appointment.findAndCountAll({ // busca citas en una fecha
            where:{dateAppointment:{
                [Op.between]:[dateAppointment+ ' 00:00:01.000',dateAppointment+ ' 23:59:00.000']
            },
            isOpened:true},
            include:[
                {
                    model:model.patient
                }
            ],
            order: [['dateAppointment', 'DESC']]
        }).then(async function(rsAppointment){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsAppointment}});
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })        
    }
}
async function getAppointmentByPay(req,res){    
   // const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    const {employeeFileId} = req.params;
    await model.appointment.findAll({ // busca citas cerrada de un doctor
        where:{
            isOpened:false,
            medialPersonal:{
                doctor:{
                    employeeId:employeeFileId
                }
            }
        }
    }).then(async function(rsAppointment){
        // busca todas citas del doctor
        await model.voucher.findAll({
            where:{employeeFileId,isActived:true}
        }).then(async function (rsVoucher){             
            let withOutVoucher=[]; //crea arreglo con citas sin Voucher del doctor
            let isVoucher=null;
            let isDetails=null;
            for (let i = 0; i < rsAppointment.length; i++) {                 
                
                console.log("cita: "+rsAppointment[i].id)
                for (let j = 0; j < rsVoucher.length; j++) { 
                    console.log("recorriendo recibos")
                    if(rsVoucher[j]){
                        for (let k=0;k<rsVoucher[j].details.length; k++)  {
                            if (rsAppointment[i].id==rsVoucher[j].details[k].appointmentId) {
                                isDetails=false; 
                                console.log("iguales");
                            }else{
                                isDetails=true ;
                                console.log("Diferentes") ;
                            }            
                            console.log(isDetails);
                        } 
                    }else{
                        isDetails=true ;
                    }                                            
                } 
                if(isDetails==true ) withOutVoucher.push({"concept":"Consulta medica","appointmentId":rsAppointment[i].id, "description":"Consulta medica "+rsAppointment[i].id})                                   
                isDetails=null;
            }
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":withOutVoucher}});                      
        }).catch(async function(error){   
            res.status(403).json({"data":{"result":false,"message":error.message}});        
        })        
    }).catch(async function(error){    
        res.status(403).json({"data":{"result":false,"message":error.message}});        
    })  
}
module.exports={appointmentNew, //Nueva cita
    updateAppointment, //mod
    getAppointment,
    getAppointmentByDoctor,
    getAppointmentByDate,
    getAppointmentByPay
}