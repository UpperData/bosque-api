const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
var moment=require('moment');

async function cancelShoppincar(req,res){
    const{itemLot,accountId,isSUW}=req.body  
    console.log(req.body)    
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Cliente cancelo pedido # "+itemLot.shoppingCarId ,// que accion se realizó        
        "account":accountId, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": itemLot
    });
    console.log("itemLot.shoppingCarId");
    console.log(itemLot.shoppingCarId);
    return await model.shoppingCar.update({orderStatusId:6},{where:{id:itemLot.shoppingCarId},returning: true,transaction:t})
    .then(async function (rsUpdateShpp){
       /*  var qtyCar=rsUpdateShpp.qty||0;            
        var qtyItem=itemLot.weight||0;  
        var qty=qtyItem+qtyCar; */
        // activar lote
        await model.lots.update({isActived:true},{where:{id:itemLot.lotId},transaction:t})
        .then(async function(rsActiveLot){
            await model.itemLot.update({conditionId:1/* ,weight:qty */ },{where:{id:itemLot.id},transaction:t})
            .then(async function (rsUpdateItem){           
                    t.commit();
                    res.status(200).json({"result":true,"message":"Orden liberada"});         
            }).catch(async function(error){
                console.log(error)
                t.rollback();
                res.status(403).json({"result":false,"message":"Algo salió mal activando item, intente nuevamente"});        
            })
        }).catch(async function(error){
            console.log(error)
            t.rollback();
            res.status(403).json({"result":false,"message":"Algo salió mal activando lote, intente nuevamente"});        
        })
        
    }).catch(async function(error){
        console.log(error)
        t.rollback();
        res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
        
}).catch(async function(error){
    console.log(error)
    t.rollback();
    res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});
})
}


async function editShoppincar(req,res){
    const{itemLotId,accountId,dispatch,isSUW,id}=req.body   // <<< Recibir isSUW    
    const t = await model.sequelize.transaction();
    let SUW=JSON.parse(isSUW);
    
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Cliente actualizó" ,// que accion se realizó        
        "account":accountId, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": itemLotId
    });
    return await model.shoppingCar.update({dispatch,isActived},{where:{id},transaction:t})
    .then(async function (rsUpdate){
        await model.itemLot.findOne({attributes:['weight'],where:{id:itemLotId},transaction:t})
        .then(async function (rsExistence){
            console.log("Desapcho: "+dispatch);
            if(rsExistence.weight>=parseFloat(dispatch)){
                diff=rsExistence.weight-dispatch
                if(diff>0){isActived=true;}
                else{
                    isActived=false;
                }
                await model.itemLot.update({weight:diff,isActived },
                    {where:{id:itemLotId},transaction:t})          
            }else{
                t.rollback();                                                       
                res.status(403).json({"result":false,"message":"Cantidad solicitada supera lo disponible( "+rsExistence.weight+" Kg)"});                                    
            }
        }).catch(async function(error){ 
            console.log(error)   
            t.rollback();                                                       
            res.status(403).json({"result":false,"message":"Error validando existencia, intente nuevamente"});        
        })                        
        t.commit();
        res.status(200).json({"result":true,"message":"Registro actualizado"});         
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
    })
}

async function getShoppingCar(req,res){ // busca especia de un carrito
  const {accountId} = req.params;
  let totalDolar=0;
  let totalItems=0;

  return await model.article.findAll({
    attributes:['id','name','image','description','price','isSUW'],    
    include:[{
        model:model.lots,
        attributes:['id'],
        required:true,
        include:[{
            model:model.itemLot,
            attributes:['id','weight','note','lotId'],
            required:true,            
            include:[{
                model:model.shoppingCar,
                    attributes:['id','dispatch'],
                    required:true,
                    where:{orderStatusId:{[Op.lte]:3}},
                    include:[{                        
                        model:model.account,
                        attributes:['id','name','phone'],
                        required:true,
                        where:{id:accountId}
                    }]
            }/* ,{
                model:model.condition, //ca
                attributes:['id','name'],
                where:{id:2},
                required:true,
            } */
            ]
        }]
    }]
  }).then(async function(rsCar){
    
    let itemOrder=[];
    let ProductItems=[];
    for (let index = 0; index <  rsCar.length; index++) { //nivel artículo
        
        itemOrder.push({    
            account:null,                        
            productId:rsCar[index].id,
            productName:rsCar[index].name,
            productDescription:rsCar[index].description,
            productImage:rsCar[index].image,
            productPrice:rsCar[index].price,
            productSUW:rsCar[index].isSUW,
            productSubTotal:0,
            productNumItem:0,
            ProductItems:[]
        });        
        let subT=0.0;
        let salePrice=0.0;
        let accountS=0;
        for (let Jindex = 0; Jindex <  rsCar[index]['lots'].length; Jindex++) {  // nivel lote        
            if(rsCar[index]['lots'].length>0){
                for (let Kindex = 0; Kindex <  rsCar[index]['lots'][Jindex]['itemLots'].length; Kindex++) { // Nivel item lote
                    
                    
                    let weight=rsCar[index]['lots'][Jindex]['itemLots'][Kindex].weight
                    
                    for (let Mindex = 0; Mindex <  rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'].length; Mindex++) {  // nivel shoppingCar
                        if(rsCar[index].isSUW){//Si se vende por unidad
                            salePrice=rsCar[index]['lots'][Jindex]['itemLots'][Kindex].weight * rsCar[index].price;
                        }else{
                            salePrice=parseFloat(rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'][Mindex].qty) * rsCar[index].price;
                        }
                        subT =subT + parseFloat(salePrice);
                        ProductItems.push({ 
                            id:rsCar[index]['lots'][Jindex]['itemLots'][Kindex].id,
                            lotId:rsCar[index]['lots'][Jindex]['itemLots'][Kindex].lotId,
                            weight:parseFloat(weight).toFixed(2),                            
                            dispatch:rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'][Mindex].dispatch,
                            quantity:rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'][Mindex].qty || "0.0",
                            price:salePrice.toFixed(2)|| "0.0",
                            shoppingCarId:rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'][Mindex].id
                        });

                    }
                    
                    
                }         
            }
        }
        
        itemOrder[index].productNumItem=ProductItems.length; // numero te productos de un mismo tipo
        itemOrder[index].productSubTotal=subT || 0//sub total
        itemOrder[index].ProductItems=ProductItems || 0;
        totalDolar += subT || 0;
        totalItems += ProductItems.length;
        subT =0;
        ProductItems=[]; 
    } 
    res.status(200).json({"result":true,"message":"Busqueda satisfactoria","data":{accountId,totalDolar,totalItems,itemOrder}}); 
  }).catch(async function(error){  
    console.log(error);     
    res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
}) 
}
async function AddShoppingCar(req,res){      
    const{itemLotId,accountId,dispatch,isSUW,qty}=req.body   // <<< Recibir isSUW
    // const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));         
    const t = await model.sequelize.transaction();
    let SUW=JSON.parse(isSUW);
    
    let audit=[]
    const toDay=moment().format('lll');   
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
                let rsCondition;
                if(rsAccount.count>0){ // cuenta activa
                    // so lote y item estan activos
                    itemActived=await model.itemLot.findAll({
                        where:{id:itemLotId,conditionId:1}                        
                    })
                    if(itemActived.length>0){ // si item esta disponible
                        if(SUW){ // venta por unidapesada
                            newQty=0
                            rsCondition=await model.itemLot.update({conditionId:2},{where:{id:itemLotId},transaction:t})    
                            // buca si tiene más lotes
                            lot = await model.itemLot.findAndCountAll({where:{lotId:itemActived[0].lotId,conditionId:1},transaction:t}) //
                            // valida si es el último item del lote
                            if(lot.count==1){  
                                // unactiva lote si es el ultimo
                                await model.lots.update({isActived:false},{where:{id:lot.rows[0].lotId},transaction:t})
                              }
                        }else{ // venta por kg
                            // calcular existencia
                            await model.itemLot.findOne({attributes:['weight'],where:{id:itemLotId},transaction:t})
                            .then(async function (rsExistence){
                                console.log("Desapcho: "+qty);
                                newQty=qty
                                if(parseFloat(rsExistence.weight)>=parseFloat(qty)){
                                    diff=parseFloat(rsExistence.weight)-parseFloat(qty)
                                    if(diff>0){isActived=true;}
                                    else{
                                        isActived=false;
                                    }
                                    await model.itemLot.update({weight:diff,isActived },
                                        {where:{id:itemLotId},transaction:t})          
                                }else{
                                    t.rollback();                                                       
                                    res.status(403).json({"result":false,"message":"Cantidad solicitada supera lo disponible( "+rsExistence.weight+" Kg)"});                                    
                                }
                            }).catch(async function(error){ 
                                console.log(error)   
                                t.rollback();                                                       
                                res.status(403).json({"result":false,"message":"Error validando existencia, intente nuevamente"});        
                            })                        
                        }
                        await model.shoppingCar.create({itemLotId,accountId,dispatch,orderStatusId:1,newQty,audit},{transaction:t})
                        .then(async function(rsCar){                       
                            t.commit();
                            res.status(200).json({"result":true,"message":"Ok. Reserva exitosa, vea 'Mis pedidos' "}); 
                        }).catch(async function(error){  
                            console.log(error);  
                            t.rollback();                                                       
                            res.status(403).json({"result":false,"message":"Error en reservación, intente nuevamente"});        
                        })
                    }else{
                        t.rollback();                                                       
                        res.status(403).json({"result":false,"message":"Producto agotado"});        
                    } 
                    
                }else{// cuenta inactiva
                    t.rollback();
                    res.status(403).json({"result":false,"message":"No posee una cuenta activa para comprar"});        
                }
            }).catch(async function(error){ 
                console.log(error)                          
                t.rollback();
                res.status(403).json({"result":false,"message":"No se pudo validar su usuario, intente nuevamente"});        
            })            
        } else{// Producto no disponible
            t.rollback();
            res.status(403).json({"result":false,"message":"Ya no esta disponible el producto, elija otro."});        
        }
    }).catch(async function(error){                   
        t.rollback();
        res.status(403).json({"result":false,"message":"No se pudo validar su producto, intente nuevamente"});        
    }) 
    
         
}


module.exports={getShoppingCar,AddShoppingCar,editShoppincar,cancelShoppincar};