const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
var moment=require('moment');

async function payCar(req,res){
    const itemsPay=req.body;
    console.log(itemsPay);    
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Confirmo pago" ,// que accion se realizó  
        "people":dataToken.people.document,// quien la realizo (Nombre)      
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "client": itemsPay[0]["account.id"] , 
        "values":req.body // valires que actualizo
    });
    let counterUpdate=0;
    for (let index = 0; index < itemsPay.length; index++) { // recorre lista de reservas a pagar
        console.log("itemsPay[index].shoppingCarId");
        console.log(itemsPay[index].shoppingCarId);
        // actualiza el carrito a pagado       
        await model.shoppingCar.update({orderStatusId:4},{where:{id:itemsPay[index].shoppingCarId}},{transaction:t})
        .then(async function(rsUpdateCar){
            // actualiza el item a vendido
            await model.itemLot.update({conditionId:3},{where:{id:itemsPay[index]["itemLot.id"]}},{transaction:t})
            .then(async function(rsUpdateItem){
                counterUpdate+=1; // incrementa contador de pagos de la lista
            }).catch(async function(error){
                console.log(error)
                t.rollback();
                res.status(403).json({"result":false,"message":"No se puede procesar item código: "+rsCar.itemLotId});        
            })  
        }).catch(async function(error){
            console.log(error)
            t.rollback();
            res.status(403).json({"result":false,"message":"No se puede procesar pedido código: "+reservationsArray[index].id});        
        }) 
    }
    if(counterUpdate==itemsPay.length){
        res.status(200).json({"result":true,"message":"Pago registrado con exito"}); 
    } 
}

async function editShoppincarOneField(req,res){
    const{field,value,id}=req.body     
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Actualizó carrito" ,// que accion se realizó  
        "people":dataToken.people.document,// quien la realizo (Nombre)      
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": id + "<-- Item afectado", 
        "values":req.body // valires que actualizo
    });

    await model.shoppingCar.findOne({
        attributes:['id','finalWeigth','itemLotId'],
        where:{id},        
        include:[{
            model:model.itemLot,
                attributes:['id'],
                required:true,
                include:[{
                    model:model.lots,
                        attributes:['id'],
                        required:true,
                        include:[{
                            model:model.article,
                                attributes:['isSUW'],
                                required:true
                        }]
                }]
        }],
        raw:true
    }).then(async function (rsCar) {          
        
        await model.shoppingCar.update({[field]:parseFloat(value).toFixed(2)},{where:{id:rsCar.id},transaction:t})
        .then(async function (rsUpdate){
            console.log("req.body")
            console.log(req.body)
            console.log("rsCar['itemLot.lot.article.isSUW']")
            console.log(rsCar['itemLot.lot.article.isSUW'])
            if(!rsCar['itemLot.lot.article.isSUW']){ // Si se vende a granel               
                await model.itemLot.findOne({attributes:['weight'],where:{id:rsCar["itemLot.id"]},transaction:t})
                .then(async function (rsExistence){  
                    diff=parseFloat(rsExistence.weight).toFixed(2)-parseFloat(value).toFixed(2)
                    if(diff>0){
                        console.log("hay disponible")                        
                        let isActived;
                        if(diff>0){isActived=true;}
                        else{
                            isActived=false;
                        }
                        await model.itemLot.update({weight:parseFloat(diff).toFixed(2),isActived },
                            {where:{id:rsCar.itemLotId},transaction:t})
                        .then(async function(rsUpdateStock){
                            t.commit();
                            res.status(200).json({"result":true,"message":"Registro actualizado"}); 
                        }).catch(async function(error){ 
                            console.log(error)   
                            t.rollback();                                                       
                            res.status(403).json({"result":false,"message":"Error validando existencia, intente nuevamente"});        
                        })
                                
                    }else{
                        console.log("Cantidad solicitada supera lo disponible( "+rsExistence.weight+" Kg)") 
                        t.rollback();                                                       
                        res.status(200).json({"result":false,"message":"Cantidad solicitada supera lo disponible( "+rsExistence.weight+" Kg)"});                                    
                    }
                }).catch(async function(error){ 
                    console.log(error)   
                    t.rollback();                                                       
                    res.status(403).json({"result":false,"message":"Error validando existencia, intente nuevamente"});        
                })
            } else{
                t.commit();
                res.status(200).json({"result":true,"message":"Registro actualizado"}); 
            }               
            
                                           
        }).catch(async function(error){
            console.log(error)
            t.rollback();
            res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
        })
            
    }).catch(async function(error){
        console.log(error)
        t.rollback();
        res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
    })
}


async function cancelShoppincar(req,res){
    const{itemLot,shoppingCarId,shoppingCarQty,accountId,isSUW}=req.body         
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Cliente cancelo pedido # "+itemLot.shoppingCarId ,// que accion se realizó        
        "account":accountId, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": itemLot
    });
   
    return await model.shoppingCar.update({orderStatusId:6},{where:{id:shoppingCarId},returning: true,transaction:t})
    .then(async function (rsUpdateShpp){       
        
        //Busca lote activo actual para el articulo
         let activeLot=await model.lots.findOne({attributes:['id'], where:{isActived:true}})
        if(isSUW){
            // activar lote si es SUW       
            await model.lots.update({isActived:true},{where:{id:itemLot.lotId},transaction:t})
                .then(async function(rsActiveLot){
                    await model.itemLot.update({conditionId:1 },{where:{id:itemLot.id},transaction:t})
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
        }else{ // si es venta a granel 
            await model.itemLot.findOne({attributes:['id','weight'], where:{id:itemLot.id}})
            .then(async function(rsFnItemLot){
                // repone el lote
                let reposition=parseFloat(rsFnItemLot.qty)+parseFloat(shoppingCarQty)
                await model.itemLot.update({weight:reposition}, {where:{id:itemLot.id}},{transaction:t})
                .then(async function (rsUpdateItem){                         
                    t.commit();
                    res.status(200).json({"result":true,"message":"Orden liberada"});         
                }).catch(async function(error){
                    console.log(error)
                    t.rollback();
                    res.status(403).json({"result":false,"message":"Algo salió mal activando item, intente nuevamente"});        
                })
            })
        }  
    }).catch(async function(error){
        console.log(error)
        t.rollback();
        res.status(403).json({"result":false,"message":"Algo salió mal, intente nuevamente"});        
})
}

async function editShoppincar(req,res){
    const{itemLotId,accountId,dispatch,qty,isSUW,id,discount,finalWeigth}=req.body   // <<< Recibir isSUW    
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const t = await model.sequelize.transaction();
    let audit=[]
    const toDay=moment().format('lll');   
    audit.push({
        "action":"Actualizó carrito" ,// que accion se realizó  
        "people":dataToken.people.document,// quien la realizo (Nombre)      
        "account":accountId, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "itemLot": itemLotId + "<-- Item afectado", 
        "values":{discount,finalWeigth} // valires que actualizo
    });
    return await model.shoppingCar.update({discount,finalWeigth},{where:{id},transaction:t})
    .then(async function (rsUpdate){
        if(!isSUW){ // Si se vende a granel
            await model.itemLot.findOne({attributes:['weight'],where:{id:itemLotId},transaction:t})
            .then(async function (rsExistence){           
                if(parseFloat(rsExistence.weight).toFixed(2)>=parseFloat(finalWeigth).toFixed(2)){
                    diff=parseFloat(rsExistence.weight).toFixed(2)-parseFloat(finalWeigth).toFixed(2)
                    let isActived;
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
            }
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
                            salePrice=parseFloat(rsCar[index]['lots'][Jindex]['itemLots'][Kindex].weight) * parseFloat(rsCar[index].price);
                        }else{
                            salePrice=parseFloat(rsCar[index]['lots'][Jindex]['itemLots'][Kindex]['shoppingCars'][Mindex].qty) * parseFloat(rsCar[index].price);
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
    console.log(req.body) 
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
                    // si lote y item estan activos
                    itemActived=await model.itemLot.findOne({
                        where:{id:itemLotId,conditionId:1}                        
                    })
                    if(itemActived){ // si item esta disponible
                        if(SUW){ // venta por unidapesada
                            newQty=0
                            rsCondition=await model.itemLot.update({conditionId:2},{where:{id:itemLotId},transaction:t})    
                            // busca si tiene más lotes
                            lot = await model.itemLot.findAndCountAll({where:{lotId:itemActived.lotId,conditionId:1},transaction:t}) //
                            // valida si es el último item del lote
                            console.log(lot)
                            if(lot.count==0){  
                                // unactiva lote si es el ultimo
                                await model.lots.update({isActived:false},{where:{id:itemActived.lotId},transaction:t})
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
        console.log(error);
        t.rollback();
        res.status(403).json({"result":false,"message":"No se pudo validar su producto, intente nuevamente"});        
    }) 
    
         
}


module.exports={
    getShoppingCar, // obtiene item del carrito
    AddShoppingCar, // agrega items al carrito
    editShoppincar, // eita todos los item del carrito
    cancelShoppincar, // cliente anula pedido del carrito
    editShoppincarOneField, // edita un acampo de shoppincar
    payCar // oricesa pago de chippingcar

};