const model=require('../db/models/index');
const { Op } = require("sequelize");

async function history(req,res){
    const {id}=req.params;
    await model.patient .findOne({  
        where:{id},      
        include:[
            {
                model:model.appointment,
                attributes:[['id','appoitnmentId'],'dateAppointment'],
                where:{isOpened:false},
                include:[
                    {
                        model:model.medicalReport
                        
                    },
                    {
                        model:model.appointmentType,
                        attributes:[['id','patientTypeId'],'name','icon']
                    }
                ]
            }
        ]
    }).then(async function(rsPatienet){
        res.status(200).json({"data":{"result":true,"message":"Busqueda Satisfactorio","data":rsPatienet}});
    }).catch(async function(error){   
        console.log(error);        
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    });
}
module.exports={history}