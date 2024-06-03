const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
const generals=require('./generals.ctrl');

//Reportes de RRHH

//-	Obtener personal activo
async function employeeFileActived(req,res){
    const {startDate,endDate}=req.params
    return await model.employeeFile.findAndCountAll({
        attributes:['id','fisrtName','lastName','documentId','email','cargo','phone','photo','isActive',['createdAt','fechaRegistro']],
        where:{
            isActive:true,
            createdAt:{
                [Op.between]:[startDate,endDate]
            }
        },
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
async function employeeFileNoActived(req,res){
    const {startDate,endDate}=req.params
    return await model.employeeFile.findAndCountAll({
        where:{
            isActive:false,
            createdAt:{
                [Op.between]:[startDate,endDate]
            }
        },
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
async function employeeFileFemale(req,res){
    const {startDate,endDate}=req.params
    return await model.employeeFile.findAndCountAll({
        attributes:['id','fisrtName','lastName','documentId','email','cargo','phone','photo','isActive',['createdAt','fechaRegistro']],
        where:{
            isActive:true,
            documentId:{
                gender:"M"
            },
            createdAt:{
                [Op.between]:[startDate,endDate]
            }
        },
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
async function employeeFileMale(req,res){
    const {startDate,endDate}=req.params
    return await model.employeeFile.findAndCountAll({
        attributes:['id','fisrtName','lastName','documentId','email','cargo','phone','photo','isActive',['createdAt','fechaRegistro']],
        where:{
            isActive:true,
            documentId:{
                gender:"H"
            },
            createdAt:{
                [Op.between]:[startDate,endDate]
            }
        },
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}

//Atencion medica
//citas cerradadas
async function appointmenClosed(req,res){
    const {startDate,endDate}=req.params
    return await model.appointment.findAndCountAll({
        attributes:[['foreignId','id'],['dateAppointment','fecha'],['hourAppointment','hora'],'siniestroId','isOpened',['createdAt','fechaRegistro']],
        where:{
            isOpened:false,
            dateAppointment:{
                [Op.between]:[startDate,endDate]
            }
        },include:[
            {
                model:model.patient,
                attributes:['document','nombre','apellido','edad'],
                include:[
                    {
                        model:model.patientType ,
                        attributes:['id','name']
                    }
                ]
            }
        ]
        ,
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//citas abiertas
async function appointmenOpened(req,res){
    const {startDate,endDate}=req.params
    return await model.appointment.findAndCountAll({
        attributes:[['foreignId','id'],['dateAppointment','fecha'],['hourAppointment','hora'],'siniestroId','isOpened',['createdAt','fechaRegistro']],
        where:{
            isOpened:true,
            dateAppointment:{
                [Op.between]:[startDate,endDate]
            }
        },include:[
            {
                model:model.patient,
                attributes:['document','nombre','apellido','edad'],
                include:[
                    {
                        model:model.patientType ,
                        attributes:['id','name']
                    }
                ]
            }
        ]
        ,
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//citas tipo APS
async function appointmenAPS(req,res){
    const {startDate,endDate}=req.params
    return await model.appointment.findAndCountAll({
        attributes:[['foreignId','id'],['dateAppointment','fecha'],['hourAppointment','hora'],'siniestroId','isOpened',['createdAt','fechaRegistro']],
        where:{
            appointmentTypeId:1,
            dateAppointment:{
                [Op.between]:[startDate,endDate]
            }
        },include:[
            {
                model:model.patient,
                attributes:['document','nombre','apellido','edad'],
                include:[
                    {
                        model:model.patientType ,
                        attributes:['id','name']
                    }
                ]
            }
        ]
        ,
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//citas tipo domicilairio
async function appointmenDocicilio(req,res){
    const {startDate,endDate}=req.params
    return await model.appointment.findAndCountAll({
        attributes:[['foreignId','id'],['dateAppointment','fecha'],['hourAppointment','hora'],'siniestroId','isOpened',['createdAt','fechaRegistro']],
        where:{
            appointmentTypeId:2,
            dateAppointment:{
                [Op.between]:[startDate,endDate]
            }
        },include:[
            {
                model:model.patient,
                attributes:['document','nombre','apellido','edad'],
                include:[
                    {
                        model:model.patientType ,
                        attributes:['id','name']
                    }
                ]
            }
        ]
        ,
        order:['createdAt']
    }).then(async function(rsEmployee){
        res.status(200).json(rsEmployee)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//articulos en stock minimo
async function inventoryLowStock(req,res){
    return await model.inventory.findAndCountAll({
        attributes:['id','articleId','minStock','existence','price'],
        where:{
            minStock: {
                [Op.gte]: model.sequelize.col('existence')
            }
        },
        include:[
            {
                model:model.article,
                attributes:['id','name']
            }
        ]
    }).then(async function(rslowStock){
        res.status(200).json(rslowStock)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//articulos agotados
async function inventorySoldOut(req,res){
    return await model.inventory.findAndCountAll({
        attributes:['id','articleId','minStock','existence','price'],
        where:{
            existence:0
        },
        include:[
            {
                model:model.article,
                attributes:['id','name']
            }
            
        ]
    }).then(async function(rslowStock){
        res.status(200).json(rslowStock)
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
//-	Obtener Artículos sin existencia en almacén (si en tránsito)
async function inventoryOutWharehouse(req,res){
    return await model.inventory.findAndCountAll({
        attributes:['id','articleId','minStock','existence','price'],
        where:{
            existence: {
                [Op.gte]: 1 
            }
        },
        include:[
            {
                model:model.article,
                attributes:['id','name'],
                required:false,
                include:[
                    {
                        model:model.assignment,
                        attributes:['id','quantity'],
                        required:true,
                        where:{
                            isActived:true
                        },
                    }
                ]
            }
        ]
    }).then(async function(rsInventory){
        let totalAsignament=0;
        let outWharehouse=[];
        for (let index = 0; index < rsInventory['rows'].length; index++) {
           
            if( rsInventory['rows'][index]['article']){ //recorre el inventario
                //suma las asignaciones
                for (let j = 0; j < rsInventory['rows'][index]['article']['assignments'].length; j++) {
                    totalAsignament+=rsInventory['rows'][index]['article']['assignments'][j].quantity                
                }
                if(rsInventory['rows'][index].existence<=totalAsignament){ //compara existencia con total asignado
                    outWharehouse.push(rsInventory['rows'][index])
                }
            }            
        }
        res.status(200).json(outWharehouse);
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}

//-	obtener Artículos en tránsito
async function inventoryInAsignment(req,res){
    return await model.inventory.findAndCountAll({
        attributes:['id','articleId','minStock','existence','price'],
        where:{
            existence: {
                [Op.gte]: 1 
            }
        },
        include:[
            {
                model:model.article,
                attributes:['id','name'],
                required:true,
                include:[
                    {
                        model:model.assignment,
                        attributes:['id','quantity'],
                        required:true,
                        where:{
                            isActived:true
                        },
                    }
                ]
            }
        ]
    }).then(async function(rsInventory){
        let totalAsignament=0;
        let inAsignment=[];   //console.log(rsInventory['rows'][0]['article'].assignments);
        for (let i = 0; i < rsInventory['rows'].length; i++) {         
            totalAsignament=0;
            for (let j = 0; j <rsInventory['rows'][i]['article']['assignments'].length; j++) {
                totalAsignament+=rsInventory['rows'][i]['article'].assignments[j].quantity                
            }    
            rsInventory['rows'][i].dataValues.totalAsignament=totalAsignament;        
            inAsignment.push(rsInventory['rows'][i]);            
        }
        res.status(200).json(inAsignment);
    }).catch(async function(error){
        console.log(error);
        res.status(403).json(error.message);
    });
}
module.exports={employeeFileActived,employeeFileNoActived,employeeFileFemale,employeeFileMale,appointmenClosed,appointmenOpened,appointmenAPS,appointmenDocicilio,inventoryLowStock,
    inventorySoldOut,inventoryOutWharehouse,inventoryInAsignment
}