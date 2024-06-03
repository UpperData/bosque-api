
const model=require('../db/models/index');
const utils = require('./utils.ctrl');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');

//registra onforme medico y cambia de estado a la cita (isOpened:false)
async function medicalRepostNew(req,res){
    const{appointmentId,description,withExams, withMedicine, medicines,exams,dosage,otherExams}=req.body;
    const t= await model.sequelize.transaction();
    await model.medicalReport.create({appointmentId,description,withExams, withMedicine, medicines,exams,dosage,otherExams},{tranasction:t})
    .then(async function(rsReport){
        await model.appointment.update({isOpened:false},{where:{id:appointmentId}},{tranasction:t})
        .then(async function(rsAppointment){
            t.commit();
            res.status(200).json({"data":{"result":true,"message":"Informe registrado satisfactoriamente"}});
        }).catch(async function(error){
            t.rollback();
            console.log(error)
            
            res.status(403).json({data:{"result":false,"message":error.message}});
        })
    }).catch(async function(error){
        console.log(error)
        t.rollback();
        if(error.name=='SequelizeUniqueConstraintError'){
            res.status(403).json({data:{"result":false,"message":"Cita ya posee informe asociado"}});    
        }else{
            res.status(403).json({data:{"result":false,"message":error.message}});
        }        
    })    
}
async function medicalReportGet(req,res){
    const {id}=req.params;
    await model.medicalReport.findOne({        
        where:{id}
    }).then(async function(rsReport){
        res.status(200).json({"data":{"result":true,"message":"Busqueda satisfactoria","data":rsReport}});
    }).catch(async function(error){        
        res.status(403).json({data:{"result":false,"message":"Algo salió mal buscando registro"}});
    })
}
async function medicalReportGetByDoctor(req,res){
    const {id}=req.params;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));    
    if(dataToken){
        const employee=await model.employeeFile.findOne({where:{accountId:dataToken['account'].id}});
        if(employee){
            await model.medicalReport.findOne({        
                where:{id},
                include:[
                    {
                        model:model.appointment,
                        attributes:['id','medialPersonal'],
                        where:{
                            medialPersonal:{
                                doctor:{
                                    employeeId:employee.id
                                }
                            }
                        }
                    }
                ]
            }).then(async function(rsReport){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfactoria","data":rsReport}});
            }).catch(async function(error){  
                console.log(error)      
                res.status(403).json({data:{"result":false,"message":error.message}});
            })
        }else{
            res.status(403).json({data:{"result":false,"message":"Usuario no posee ficha de empleado"}});
        }        
    }else{
        res.status(403).json({data:{"result":false,"message":"Usuario no autorizado"}});
    }
}
async function medicalReportEdit(req,res){

    const{id,appointmentId,description,withExams, withMedicine, medicines,exams,dosage, otherExams}=req.body;
    const t= await model.sequelize.transaction();
    await model.medicalReport.update({appointmentId,description,withExams, withMedicine, medicines,exams,dosage, otherExams},{where:{id}},{tranasction:t})
    .then(async function(rsReport){
        t.commit();
        res.status(200).json({"data":{"result":true,"message":"Actualización satisfactoria"}});
    }).catch(async function(error){        
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })
}

module.exports={medicalRepostNew,medicalReportGet,medicalReportEdit,medicalReportGetByDoctor}