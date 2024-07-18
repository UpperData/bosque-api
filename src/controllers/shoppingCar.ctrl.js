const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
var moment=require('moment');
const { raw } = require('express');
async function getShoppingCar(req,res){ // busca especia de un carrito
    const {accountId} = req.params;


  return await model.article.findAll({
    attributes:['id','name','image','description','price'],    
    include:[{
        model:model.lots,
        attributes:['id'],
        required:true,
        include:[{
            model:model.itemLot,
            attributes:['id','weight','note'],
            required:true,            
            include:[{
                model:model.shoppingCar,
                    attributes:['id','dispatch'],
                    required:true,
                    include:[{                        
                        model:model.account,
                        attributes:['id','name','phone'],
                        required:true,
                        where:{id:accountId}
                    }]
            },{
                model:model.condition,
                attributes:['id','name'],
                where:{id:2},
                required:true,
            }
            ]
        }]
    }]
  }).then(async function(rsCar){
    
    let carResponse=[];
    let carLot=[];
    for (let index = 0; index <  rsCar.length; index++) {
        carResponse.push({
            id:rsCar[index].id,
            name:rsCar[index].name,
            description:rsCar[index].description,
            image:rsCar[index].image,
            price:rsCar[index].price,
            carLot:[]
        });        
        for (let Jindex = 0; Jindex <  rsCar[index]['lots'].length; Jindex++) {          
            if(rsCar[index]['lots'].length>0){
                for (let Kindex = 0; Kindex <  rsCar[index]['lots'][Jindex]['itemLots'].length; Kindex++) {
                    let salePrice=rsCar[index]['lots'][Jindex]['itemLots'][Kindex].weight * rsCar[index].price;
                    let weight=rsCar[index]['lots'][Jindex]['itemLots'][Kindex].weight
                    carLot.push({ 
                        id:rsCar[index]['lots'][Jindex]['itemLots'][Kindex].id,
                        weight:parseFloat(weight).toFixed(2),
                        note:rsCar[index]['lots'][Jindex]['itemLots'][Kindex].note,
                        price:salePrice.toFixed(2)
                    });
                }                
            }                                           
        }        
        carResponse[index].carLot=carLot; 
        carLot=[]; 
    } 
    res.status(200).json({"result":true,"message":"Busqueda satisfactoria","data":carResponse}); 
  }).catch(async function(error){    
    console.log(error);         
    res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
}) 
}
async function AddShoppingCar(req,res){      
    const{itemLotId,accountId,dispatch}=req.body  
    // const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));         
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment(); 
    audit.push({
        "action":"Cliente reservó" ,// que accion se realizó        
        "account":accountId, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": itemLotId
    }); 
    //valida item disponible
    return await model.itemLot.findAndCountAll({attributes:['id'],where:{id:itemLotId,conditionId:1}})
    .then(async function(rsItem){   
        //console.log(rsItem.dataValues);
        if(rsItem.count>0){ // Item disponible            
            //valida cuenta activa
            await model.account.findAndCountAll({attributes:['id'],where:{id:accountId,isActived:true}})
            .then(async function(rsAccount){
                if(rsAccount.count>0){ // cuenta activa
                    await model.itemLot.update({conditionId:2},{where:{id:itemLotId}},{transaction:t}) // actualiza item a reservado
                    .then(async function(rsCondition){
                        await model.shoppingCar.create({itemLotId,accountId,dispatch,orderStatusId:1,audit},{transaction:t})
                        .then(async function(rsCar){                       
                            t.commit();
                            res.status(200).json({"result":true,"message":"Ok. Reserva exitosa"}); 
                        }).catch(async function(error){                                   
                            res.status(403).json({"result":false,"message":"Error en reservación, intente nuevamente"});        
                        })
                    }).catch(async function(error){                                  
                        res.status(403).json({"result":false,"message":"Error reservando producto, intente nuevamente"});        
                    })
                    
                }else{// cuenta inactiva
                    res.status(200).json({"result":false,"message":"No posee una cuenta activa para comprar"});        
                }
            }).catch(async function(error){                           
                res.status(403).json({"result":false,"message":"No se pudo validar su usuario, intente nuevamente"});        
            })            
        } else{// Producto no disponible
            res.status(200).json({"result":false,"message":"Ya no esta disponible el producto, elija otro."});        
        }
    }).catch(async function(error){                   
        res.status(403).json({"result":false,"message":"No se pudo validar su producto, intente nuevamente"});        
    }) 
    
         
}

module.exports={getShoppingCar,AddShoppingCar};