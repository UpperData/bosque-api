const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
const generals=require('./generals.ctrl');
var moment=require('moment');
const { raw } = require('express');

async function itemLotFind(req,res){ // traer items 
    const{id}=req.params
    await model.itemLot.findByPk(id)
    .then(async function(rsItemsLot){                
        
        res.status(200).json({data:{"result":true,"data":rsItemsLot}}); 
        
    }).catch(async function(error){   
        console.log(error);
        res.status(403).json({data:{"result":false,"message":error.message}});
    })       
}

async function itemLotupdate(req,res){ // edita un nuevo lote de articulos
    const{items,id,lotId}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    let audit=[]   
    const toDay=moment(); 
    audit.push({
        "action":"Editó item "+ id ,// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":{items,lotId}
    }); 
    let insert_items=0;    
    const t = await model.sequelize.transaction();     
    if(items.length>0){
        for (let index = 0; index < items.length; index++) {
            await model.itemLot.update({weight:items[index].weight,conditionId:items[index].conditionId,note:items[index].note,audit},{where:{id}},{transaction:t})
            .then(async function(rsItemsLot){                
                
                insert_items++;
                
            }).catch(async function(error){        
                t.rollback();
                res.status(403).json({data:{"result":false,"message":error.message}});
            }) 
        }
        if(insert_items){
            t.commit(); 
            res.status(200).json({data:{"result":true,"message":"Item actualizado"}});   
        }
    }else{
        t.rollback();
        res.status(403).json({data:{"result":false,"message":"Ingrese valores del item en el lote"}});
    }      
}
async function itemLotCreate(req,res){ // crea un nuevo item en un lote
    const{items,lotId}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    let audit=[]   
    const toDay=moment(); 
    audit.push({
        "action":"Creó nuevo item en el lote "+ lotId,// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":{items,lotId}
    }); 
    let insert_items=0;
    let numItem=null;
    const t = await model.sequelize.transaction(); 
    await model.itemLot.max('numItem',{where:{lotId}}) //obtiene el item mayor
    .then(async function(rsLotItemNum){               
        numItem=rsLotItemNum;
        if (!rsLotItemNum){numItem=0}   
        if(items.length>0){
            for (let index = 0; index < items.length; index++) {
                await model.itemLot.create({lotId,weight:items[index].weight,conditionId:items[index].conditionId,note:items[index].note,numItem:numItem + 1,audit},{transaction:t})
                .then(async function(rsItemsLot){                
                    
                    insert_items++;
                    
                }).catch(async function(error){        
                    t.rollback();
                    res.status(403).json({data:{"result":false,"message":error.message}});
                }) 
            }
            if(insert_items){
                t.commit(); 
                res.status(200).json({data:{"result":true,"message":"Item registrado"}});   
            }
            
   
        }else{
            t.rollback();
            res.status(403).json({data:{"result":false,"message":"Ingrese items en el lote"}});
        } 
    })  
}

async function lotEdit(req,res){
    const{articleId,receivedDate,expDate,isActived,note,lotId}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    let audit={}   
    const toDay=moment(); 
    audit={
        "action":"Modifica encabezado de lote "+lotId,// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":{articleId,receivedDate,expDate,isActived,note}
    }; 
    const t = await model.sequelize.transaction();
    await model.lots.findByPk(lotId)
    .then(async function(rsLot){
        rsLot.audit.push(audit);
        await model.lots.update({articleId,receivedDate,expDate,isActived,note,audit:rsLot.audit},{where:{id:rsLot.id}},{transaction:t})
        .then(async function(rsLotEdit){
            t.commit(); 
            res.status(200).json({data:{"result":true,"message":"Lote "+ lotId +" actualizado"}});  
        }).catch(async function(error){        
        t.rollback();
        res.status(403).json({data:{"result":false,"message":"Algo salió mal editando lote, intente nuevamente"}});
    })
    }).catch(async function(error){        
        t.rollback();
        res.status(403).json({data:{"result":false,"message":"Algo salió mal buscando lote, intente nuevamente"}});
    })
    
}
async function lotArticle(req,res){
    const{articleId,isActived}=req.params;    
    if (typeof (isActived) === "boolean") {}
    await model.lots.findAll(
    { 
        attributes: {exclude: ['audit','createdAt','updatedAt']},
        where:{
        articleId, 
        ...(isActived == "true" ||  isActived == "false" &&{
            isActived
        })},
        order:[['receivedDate','DESC']],
        include:[{            
            model:model.itemLot,
            attributes: {exclude: ['audit','createdAt','updatedAt']}
            
        }]
    })
    .then(async function(rsLots){
        if(rsLots){
            for (let i = 0; i < rsLots.length; i++) {                              
                for (let index = 0; index < rsLots[i].itemLots.length; index++) {
                    await model.condition.findOne({
                        attributes: {exclude: ['createdAt','updatedAt']},
                        where:{id:rsLots[i].itemLots[index].conditionId}
                    }).then(async function(rsCondition){
                        rsLots[i].itemLots[index].dataValues.conditionName=rsCondition.name                       
                    })
                }            
            }
        }
        res.status(200).json({data:{"result":true,"data":rsLots}}); 
        /*if(rsLots.length>0){
            let items=[];
            for (let index = 0; index < rsLots.length; index++) {
                await model.itemLot.findAll({ attributes: {exclude: ['audit']}},{where:{lotId:rsLots[index].id}})
                .then(async function(rsLotItems){
                    items.push(rsLotItems)
                })
            }
            rsLots.push(items);
            if(items.length>0){
                res.status(200).json({data:{"result":true,"data":rsLots}}); 
            }else{
                res.status(200).json({data:{"result":true,"data":rsLots,"message":"Lote no posee items"}}); 
            }
            
        }else{
            res.status(200).json({data:{"result":true,"message":"No existe lote consultado"}}); 
        }    */    
    }).catch(async function(error){ 
        console.log(error)               
        res.status(403).json({data:{"result":false,"message":"Algo salió mal, intente nuevamente"}});
    })
}
async function lotCreate(req,res){ // crea un nuevo lote de articulos
    const{articleId,receivedDate,expDate,isActived,note,items}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    let audit=[]   
    const toDay=moment(); 
    audit.push({
        "action":"Creó nuevo lote",// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":{articleId,receivedDate,expDate,isActived,note,items}
    }); 
    const t = await model.sequelize.transaction();
    await model.lots.create({articleId,receivedDate,expDate,isActived,note,audit},{transaction:t})
    .then(async function(rslot){
        let insert_items=0
        if(items.length>0){ // Registra Items
            for (let index = 0; index < items.length; index++) {
                await model.itemLot.create({lotId:rslot.id,weight:items[index].weight,conditionId:items[index].conditionId,note:items[index].note,itemLot:index + 1,audit},{transaction:t})
                .then(async function(rsItemsLot){
                
                    insert_items++;
                    
                }).catch(async function(error){        
                    t.rollback();
                    res.status(403).json({data:{"result":false,"message":error.message}});
                }) 
            }
            if(insert_items==items.length){
                t.commit(); 
                res.status(200).json({data:{"result":true,"message":"Lote registrado"}});              
            }    
        }else{ // no regsitra item y da respuesta
            t.commit(); 
            res.status(200).json({data:{"result":true,"message":"Lote registrado"}}); 
        }            
    }).catch(async function(error){        
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })
}
module.exports={lotCreate,lotArticle,lotEdit,itemLotCreate,itemLotupdate,itemLotFind}