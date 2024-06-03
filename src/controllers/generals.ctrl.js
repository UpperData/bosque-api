const model=require('../db/models/index');
const { Op } = require("sequelize");
require ('dotenv').config();
var jwt=require('jwt-simple');
const request = require("request");
async function currentAccount(token){
	try{
        //console.log(token);
		var  payload= await jwt.decode(token,process.env.JWT_SECRET);
		if (Date.now() >= payload.exp * 1000) {
			return false;
		}else{
			const dataToken={"data":{"account":payload.account,"role":payload.role, "people":payload.people,"shop":payload.shop,
			"type":payload.type,"dateStart":payload.dateTimeLogin,"bid":payload.bidId}}
			return dataToken;  
		}
	}catch(error){
        console.log(error)
		return false;
	}
}
async function getCivil(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un estado civil
        return await model.civil.findOne({
            attributes:['id','name'],
            where:{id}
        }).then(async function(rsCivil){
            if(rsCivil){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCivil}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos estado civil
        return await model.civil.findAll(            
            { attributes:['id','name']           ,
           order:['id']}).then(async function(rsCivil){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCivil}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}

async function getPhoneType(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un estado civil
        return await model.phoneType.findOne({
            attributes:['id','name','icon'],
            where:{id}
        }).then(async function(rsPhotype){
            if(rsPhotype){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPhotype}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos estado civil
        return await model.phoneType.findAll(            
            { attributes:['id','name','icon']           ,
            order:['id']}).then(async function(rsPhotype){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPhotype}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getDepartament(req,res){
	const {id}=req.params;
    if(id!='*'){
        //Busca un Departamento
        return await model.departament.findOne({
            attributes:['id','name'],
            where:{id}
        }).then(async function(rsDepartament){
            if(rsDepartament){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsDepartament}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos Sub Deaprtament
        return await model.departament.findAll(            
            { attributes:['id','name'],
            order:['id']}).then(async function(rsDepartament){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsDepartament}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    } 
}
async function getSubDepartament(req,res){
	const {depId}=req.params;
    if(depId!='*'){
        //Busca un Departamento
        return await model.subDepartament.findAll({
            attributes:['id','name'],
            where:{departamentId:depId}
        }).then(async function(rsSubDepartament){
            if(rsSubDepartament){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsSubDepartament}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos Sub Deaprtament
        return await model.subDepartament.findAll(            
            { attributes:['id','name'],
            include:[
                {
                    model:model.departament,
                    attributes:[['id','departamentId'],'name']
                }
            ],
            order:['id']}).then(async function(rsSubDepartament){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsSubDepartament}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    } 
}
async function getCargo(req,res){
	const {depId}=req.params;
    if(depId!='*'){
        //Busca un Departamento
        return await model.cargo.findAll({
            attributes:['id','name'],
            where:{departamentId:depId}
        }).then(async function(rsCargo){
            if(rsCargo){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCargo}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos Cargos de un departamento
        return await model.cargo.findAll(            
            { attributes:['id','name'],
            include:[
                {
                    model:model.departament,
                    attributes:[['id','departamentId'],'name']
                }
            ],
            order:['id']}).then(async function(rsCargo){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCargo}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    } 
}
async function getPatienType(req,res){
	const {id}=req.params;
    if(id!='*'){
        //Busca un Departamento
        return await model.patientType.findAll({
            attributes:['id','name'],
            where:{id}
        }).then(async function(rsPatientType){
            if(rsPatientType){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPatientType}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos Cargos de un departamento
        return await model.patientType.findAll(            
            { attributes:['id','name'],
            order:['id']}).then(async function(rsPatientType){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPatientType}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    } 
}
async function getState(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un estados de Venezuela
        return await model.state.findOne({
            attributes:['id','name'],
            where:{id}
        }).then(async function(rsState){
            if(rsState){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsState}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.state.findAll(            
            { attributes:['id','name']           ,
           order:['id']}).then(async function(rsState){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsState}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getCitiesByState(req,res){ 
    const {stateId}=req.params;
    if(stateId!='*'){
        //Busca un estados de Venezuela
        return await model.city.findAll({
            attributes:['id','name','isCapital'],
            where:{stateId},
            include:[
                {
                    model:model.state,
                    attributes:['id','name']
                }
            ]
        }).then(async function(rsCity){
            if(rsCity){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCity}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.city.findAll(            
            { attributes:['id','name','isCapital'],
            include:[
                {
                    model:model.state,
                    attributes:['id','name']
                }
            ],
           order:['id']}).then(async function(rsCity){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsCity}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getProvincesByState(req,res){ 
    const {stateId}=req.params;
    if(stateId!='*'){
        //Busca un estados de Venezuela
        return await model.province.findAll({
            attributes:['id','name'],
            where:{stateId},
            include:[
                {
                    model:model.state,
                    attributes:['id','name']
                }
            ]
        }).then(async function(rsProvince){
            if(rsProvince){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsProvince}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.province.findAll(            
            { attributes:['id','name'],
            include:[
                {
                    model:model.state,
                    attributes:['id','name']
                }
            ],
           order:['id']}).then(async function(rsProvince){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsProvince}});        
        }).catch(async function(errror){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getParroquiaByProvince(req,res){ 
    const {provinceId}=req.params;
    if(provinceId!='*'){
        //Busca un estados de Venezuela
        return await model.parroquia.findAll({
            attributes:['id','name'],
            where:{provinceId},
            include:[
                {
                    model:model.province,
                    attributes:['id','name']
                }
            ]
        }).then(async function(rsParroquia){
            if(rsParroquia){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsParroquia}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.parroquia.findAll(            
            { attributes:['id','name'],
            include:[
                {
                    model:model.province,
                    attributes:['id','name']
                }
            ],
           order:['id']}).then(async function(rsParroquia){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsParroquia}});        
        }).catch(async function(error){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getAppointmentTpye(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un estados de Venezuela
        return await model.appointmentType.findAll({
            attributes:['id','name','icon'],
            where:{id}
        }).then(async function(rsAppointmentType){
            if(rsAppointmentType){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsAppointmentType}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.appointmentType.findAll(            
            { attributes:['id','name','icon'],
           order:['id']}).then(async function(rsAppointmentType){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsAppointmentType}});        
        }).catch(async function(error){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function getExams(req,res){ 
    const {id}=req.params;
    if(id!='*'){
        //Busca un estados de Venezuela
        return await model.exam.findAll({
            attributes:['id','name'],
            where:{id}
        }).then(async function(rsExam){
            if(rsExam){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsExam}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){  
            console.log(error)    
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos de estados de Venezuela
        return await model.exam.findAll(            
            { attributes:['id','name'],
           order:['id']}).then(async function(rsExam){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsExam}});        
        }).catch(async function(error){            
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function generalCurrenteChange(){
    console.log("Obteniendo precio actual del dolar")
     return await model.changeType.findOne({
        attributes:[ [model.sequelize.fn('max', model.sequelize.col('id')), 'id']]
    }).then(async function(rsChangeType){
        if(rsChangeType){
            return await model.changeType.findOne({
                where:{id:rsChangeType.id}
            }).then(async function(rsChangeTypeCurrent){
                return rsChangeTypeCurrent.value; 
                if(rsChangeTypeCurrent){                    
                    return rsChangeTypeCurrent.value;                    
                }else{
                    return null;
                }
            }).catch(async function(errror){
                return null;        
            })                   
        }else{
            return null;            
        }
    }).catch(async function(errror){
        return null;
    })
}
async function getCarYear(req,res){
    request("https://carapi.app/api/years",(err,response,body)=>{
        if (!err){
            const years = JSON.parse(body);
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":years}});
        }
    })
}
async function getCarMakes(req,res){
    request("https://carapi.app/api/makes",(err,response,body)=>{
        if (!err){
            const makes = JSON.parse(body);
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":makes.data}});
        }
    })
}
/*async function getCarModels(req,res){
    request("https://carapi.app/api/models",(err,response,body)=>{
        if (!err){
            const models = JSON.parse(body);
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":models.data}});
        }
    })
}*/
async function getCarModels(req,res){
    const {make} =req.params    
    if(make== '*' ){
        request("https://carapi.app/api/models",(err,response,body)=>{
            if (!err){
                const models = JSON.parse(body);
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":models.data}});
            }
        })
    }else{
        request("https://carapi.app/api/models?make="+make,(err,response,body)=>{
            if (!err){
                const models = JSON.parse(body);
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":models.data}});
            }
        })
    }
    
}
async function getCarModelsByMakeId(req,res){
    const {makeId} =req.params
    
    if(makeId!= null ){
        request("https://carapi.app/api/models?make_id="+makeId,(err,response,body)=>{
            if (!err){
                const models = JSON.parse(body);        
                console.log(models);        
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":models}});
            }else{
                res.status(403).json({"data":{"result":false,"message":"Algo salio mal, obteniendo modelos"}});
            }
        })
    }else{
            res.status(403).json({"data":{"result":false,"message":"Debe indicar la marca del vehiculo"}});
        
    }    
}
async function getBarMenu(req,res){

    return await model.subCategory.findAll({
        where:{
            [Op.or]: [{ id: 2 }, { id: 6 },{id:10},{id:16},{id:20},{id:24},{id:28},{id:32},{id:36}], 
        }
    }).then(async function(rsSubCategory){
        res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsSubCategory}});
    }).catch(async function(error){  
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando barra de menú"}});        
    })

}

module.exports={getCivil,currentAccount,getPhoneType,getDepartament,getSubDepartament,getCargo,getPatienType,getState,getCitiesByState,
    getProvincesByState,getParroquiaByProvince,getAppointmentTpye,getExams,generalCurrenteChange,getCarYear,getCarMakes,getCarModels,
    getCarModelsByMakeId,getBarMenu}