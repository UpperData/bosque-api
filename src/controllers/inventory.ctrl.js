const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
const generals=require('./generals.ctrl');
const { compareSync } = require('bcryptjs');
const { where } = require('sequelize/lib/sequelize');
const { raw } = require('express');

async function currentArticleStock(articleId){
    try{
        rsStock= await model.article.findAndCountAll({
            where:{id:articleId},
            include:[{
                model:model.lots,                    
                    attributes:['id'] ,                   
                    where:{ isActived:true},                        
                    include:[{
                        model:model.itemLot,
                        attributes:['id','weight'],
                        where:{ conditionId:1},
                        required:true
                    }]
            }],nest: true
        });  
        console.log(rsStock.rows) 
        if(rsStock.isSUW){
            return rsStock.count + " Unit"; 
        }else{
            //return rsStock.row[0].itemLot + "kg"; 
            return rsStock.rows[0].lots.itemLots.weight + "kg"; 
        }        
        
      
    }
    catch(error){
        console.log(error);        
        return (-1)
    }
  
}
async function assignmentNew(req,res){
    const{accountId,articleId,quantity}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    const t = await model.sequelize.transaction();
    await model.accountRole.findAndCountAll({ // valida si es medico
        attributes:['id'],
        where:{
            accountId,
            roleId:[6,8,9]}
    }).then(async function(rsAccountRole){
        if(rsAccountRole.count>0){
            // valida existencia en inventario
            await model.inventory.findOne({
                attributes:['id','existence'],
                where:{articleId}
            }).then(async function(rsExistence){                
                if(rsExistence ){
                    if(rsExistence.existence>=quantity){
                        await model.assignment.create({accountId:accountId, articleId, quantity,responsible:{"account":dataToken['account'],"people":dataToken['people']}},{transaction:t}).then(async function(rsAssignmet){
                        }).then(async function(rsAppointment){
                            t.commit();
                            res.status(200).json({data:{"result":true,"message":"Asignación satisfactoria"}});
                        }).catch(async function(error){                
                            t.rollback();
                            res.status(403).json({data:{"result":false,"message":error.message}});
                        })
                    }else{                    
                        res.status(403).json({data:{"result":false,"message":"Existencia("+rsExistence.existence+") es menor a cantidad asignada"}});
                    }                    
                }else{                    
                    res.status(403).json({data:{"result":false,"message":"Articulo no existe en inventario"}});
                }
            }).catch(async function(error){                
                t.rollback();
                res.status(403).json({data:{"result":false,"message":error.message}});
            })          
        }else{
            t.rollback();
            res.status(403).json({data:{"result":false,"message":"Cuenta no tiene membresía de médico"}});
        }        
    }).catch(async function(error){                
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })    
}
async function assignmentByDoctor(req,res){
    const{accountId}=req.params;
    await model.accountRole.findAndCountAll({
        attributes:['id'],
        where:{
            accountId,
            roleId:[6]}
    }).then(async function(rsAccountRole){
        if(rsAccountRole.count>0){
            await model.assignment.findAll({
                where:{accountId,isActived:true},
                include:[                    
                    {
                        model:model.article,
                        attributes:['id','name','description']
                    }
                ]
            }).then(async function(rsAssignmet){                
                res.status(200).json({data:{"result":true,"message":"Busqueda satisfactoria","data":rsAssignmet}});
            }).catch(async function(error){
                console.log(error);                
                res.status(403).json({data:{"result":false,"message":error.message}});
            })
        }else{
            
            res.status(403).json({data:{"result":false,"message":"Cuenta no tiene membresía de médico"}});
        }
    }).catch(async function(error){                        
        res.status(403).json({data:{"result":false,"message":error.message}});
    }) 
}
async function assignmentUpdate(req,res){
    const{assignmentId,accountId,articleId,quantity}=req.body;
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    const t = await model.sequelize.transaction();
    await model.accountRole.findAndCountAll({
        attributes:['id'],
        where:{
            accountId,
            roleId:[6,8,9]}
    }).then(async function(rsAccountRole){
        if(rsAccountRole.count>0){
            await model.inventory.findOne({
                attributes:['id','existence'],
                where:{articleId}
            }).then(async function(rsExistence){               
                if(rsExistence ){
                    if(rsExistence.existence>=quantity){
                        await model.assignment.update(
                            {accountId:accountId, articleId, quantity,responsible:{"account":dataToken['account'],"people":dataToken['people']}},
                            {where:{id:assignmentId}},{transaction:t}).then(async function(rsAssignmet){
                        }).then(async function(rsAppointment){
                            t.commit();
                            res.status(200).json({data:{"result":true,"message":"Asignación satisfactoria"}});
                        }).catch(async function(error){
                            console.log(error);
                            t.rollback();
                            res.status(403).json({data:{"result":false,"message":error.message}});
                        })
                    }else{
                        res.status(403).json({data:{"result":false,"message":"Cantidad mayor a la existencia"}});
                    }
                }else{
                    t.rollback();
                    res.status(403).json({data:{"result":false,"message":"Articulo no existe"}});
                }  
            })
        }else{
            t.rollback();
            res.status(403).json({data:{"result":false,"message":"Cuenta no tiene membresía de médico"}});
        }       
    }).catch(async function(error){                
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })    
}

async function articleNew(req,res){
    const{name,description,minStock,image,price,isSUW}=req.body;
    const t=await model.sequelize.transaction();
    var maxArticle=await model.sequelize.query("SELECT max(id) + 1 as proximo from articles");    
    await model.article.create({id:maxArticle[0][0].proximo,name,description,minStock,image,price,isSUW},{transaction:t},{returning: true}).
        then(async function(rsArticle){
            t.commit();
            res.status(200).json({data:{"result":true,"message":"Artículo agregado"}});
    }).catch(async function(error){       
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })
}
async function articleUpdate(req,res){
    const dataToken=await generals.currentAccount(req.header('Authorization').replace('Bearer ', ''));
    const{id,name,description,isActived,price,minStock,image,isSUW}=req.body;
    const t=await model.sequelize.transaction();
    await model.article.update({name,description,isActived,price,minStock,image,isSUW},{where:{id}},{transaction:t}).then(async function(rsArticle){
        t.commit();
        res.status(200).json({data:{"result":true,"message":"Artículo actualizado"}});
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}});
    })
}
async function inventoryGet(req,res){    
    const {articelId,isArtActived,isLotActived,conditionId}=req.params;
    if(articelId!='*'){        
        return await model.article.findOne({
            attributes:['id','name','description','price','image','minStock','isSUW','isActived'],
            where:{
                id:articelId,
                isActived:isArtActived 
                /* ...(isArtActived == "true" ||  isArtActived == "false" && {
                    isActived:isArtActived}) */
            },
            include:[{
                model:model.lots,
                attributes:{exclude:['audit','updatedAt','createdAt']} ,                   
                where:{ isActived:isLotActived},
                require:true,             
                include:[{
                    model:model.itemLot,
                    attributes:{exclude:['audit','updatedAt','createdAt']},
                    where:{ conditionId},
                    required:true
                }]
            }]
        }).then(async function(rsArticle){
            if(rsArticle){
                res.status(200).json({"result":true,"message":"Busqueda satisfatoria","data":rsArticle});        
            }else{
                res.status(403).json({"result":false,"message":"No se encontraron registros"});            
            }            
        }).catch(async function(error){  
            res.status(403).json({"result":false,"message":"Algo salió mal buscando registro"});        
        })
    }else{        
        return await model.article.findAll({
            attributes:['id','name','description','price','image','minStock','isSUW','isActived'],
            where:{
                isActived:isArtActived 
            },
            include:[{
                model:model.lots,
                attributes:{exclude:['audit','updatedAt','createdAt']} ,                   
                where:{ isActived:isLotActived},
                require:true,             
                include:[{
                    model:model.itemLot,
                    attributes:{exclude:['audit','updatedAt','createdAt']},
                    where:{ conditionId},
                    required:true
                }]
            }]
        }).then(async function(rsArticle){
            if(rsArticle){
                res.status(200).json({"result":true,"message":"Busqueda satisfatoria","data":rsArticle});        
            }else{
                res.status(403).json({"result":false,"message":"No se encontraron registros"});            
            }            
        }).catch(async function(error){  
            res.status(403).json({"result":false,"message":"Algo salió mal buscando registro"});        
        })
    }    
}
async function articlelist(req,res){    
    const {id}=req.params;
    if(id!='*'){        
        return await model.article.findOne({
            attributes:['id','name','description','minStock','price','image','isSUW'],
            where:{id,isActived:true}
        }).then(async function(rsArticle){
            if(rsArticle){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsArticle}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe artículo con este código"}});            
            }            
        }).catch(async function(error){  
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{        
        return await model.article.findAll({
            attributes:['id','name','description','minStock','price','image','isSUW'],
            where:{isActived:true}
        }).then(async function(rsArticle){
            if(rsArticle){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsArticle}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe artículo con este código"}});            
            }            
        }).catch(async function(error){                        
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }    
}
async function inventoryAdd(req,res){
    const {articleId,existence,minStock,price,category,sku,autoType,filter, description,tags, photo}=req.body
    await model.inventory.findAndCountAll({articleId,isActived:true})
    .then(async function(rsFind){

        if(rsFind.count>0){ // inventory update

        }else{
            await model.inventory.create({articleId,existence,minStock,price,category,sku,filter, description,tags, photo})
            .then(async function(rsInventoryCreate){

            })
        }
        
    })    
}
async function inventoryTotal(req,res){ // optiene el inventario actual, hoja de inventario
    const dataToken=await generals.currentAccount(req.header('Authorization').replace('Bearer ', ''));
    await model.article.findAll({
        attributes:['id','name','description','isActived','isSUW','price','minStock'],        
        order:['name','isActived']
    }).then(async function(rsInventory){
        
        // obtener item disponibles para el artocilo
        // const dolar= await generals.generalCurrenteChange();
        // variable precio total
        let totalPriceInventory=0;
        // Buscar lo que esta en transito por cada articulo               
        for (let index = 0; index < rsInventory.length; index++) {
            let asignados=0;
            asignados= await model.assignment.findOne({
                attributes:[
                    [model.sequelize.fn('sum', model.sequelize.col('quantity')), 'total_asignament']],
                where:{articleId:rsInventory[index].dataValues.id,isActived:true}
            }) 
            rsInventory[index].dataValues.almacen=0; // Valor predeterminado
            rsInventory[index].dataValues.dolarValue=0;
            
            rsInventory[index].dataValues.almacen= await currentArticleStock(rsInventory[index].dataValues.id);
            rsInventory[index].dataValues.dolarValue=Number(rsInventory[index].price).toFixed(2); //agrega precio en dolares segun el valor actual
            totalPriceInventory=totalPriceInventory+( Number(rsInventory[index].price) * Number(rsInventory[index].existence));
        }    
        //rsInventory.push({bolivaresTotalInventory:totalPriceInventory.toFixed(2)});
        //rsInventory.push({dolarTotalInventory:Number(totalPriceInventory/dolar).toFixed(2)});     
        res.status(200).json({"items":rsInventory,bolivaresTotalInventory:totalPriceInventory.toFixed(2),dolarTotalInventory:Number(totalPriceInventory).toFixed(2)});          
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando inventario"}});  
    })
}
async function inventoryUpdate(req,res){
    const {articleId,existence,minStock,price,category,sku,filter, description,tags, photo,autoTypeId}=req.body
  
    const dataToken=await generals.currentAccount(req.header('Authorization').replace('Bearer ', ''));
    await model.assignment.findOne({
        attributes:[[model.sequelize.fn('sum', model.sequelize.col('quantity')), 'total_amount']], // sumatoria de asignaciones para ete articulo
        where:{articleId,isActived:true}
    }).then(async function(rsAssinament){
        if(rsAssinament.total_amount<existence) { // La existencia no debe ser menos a lo que esta en asignación
            res.status(403).json({"data":{"result":false,"message":"Existencia debe ser mayor o igual a ". rsAssinament.total_amount}});
        }else{
            await model.inventory.update({articleId,existence,minStock,price,category,sku,filter, description,tags, photo,autoTypeId},{where:{articleId}}).then(async function(rsInventory){
                res.status(200).json({"data":{"result":true,"message":"Inventario actualizado","data":rsInventory}});  
            }).catch(async function(error){
                console.log(error);
                res.status(403).json({"data":{"result":false,"message":error.message}});  
            })
        }
    }).catch(async function(error){    
         console.log(error);    
        res.status(403).json({"data":{"result":false,"message":error.message}});  
    })   
}

async function assignmentRevoke(req,res)  {
    const {id}=req.params;
    // restar de la asignación    
    await model.assignment.update({isActived:false},{where:{id}}).then(async function(rsInventory){         
        res.status(200).json({"data":{"result":true,"message":"Asignación devuelta con exito"}}); 
    }).catch(async function(error){
        res.status(403).json({"data":{"result":false,"message":error.message}});  
    })
}
async function returnArticleArray(req,res){

    let articleList=req.query;   
    if(!Array.isArray(articleList.qs)){ // cuando pasa un solo elemento (no es un arreglo) lo convierte en arreglo
        articleList.qs = new Set([articleList.qs]);
        articleList.qs = Array.from(articleList.qs, x => String(x));
        //console.log(articleList.qs);        // Salida: ['2', '4', '6', '8' ]
    }
    await model.inventory.findAll({  
        attributes:{exclude:['updatedAt','createdAt','id']},  
        include:[{
            model:model.article,
            attributes:['id','name']
        }],   
        where:{
            articleId:{[Op.or]:articleList.qs}
        }
    
    }).then(async function(rsInventory){         
        res.status(200).json({"data":{"result":true,"message":"Consulta satisfactoria","data":rsInventory}}); 
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":error.message}});  
    })

}
module.exports={assignmentNew
    ,assignmentByDoctor
    ,assignmentUpdate
    ,articleNew
    ,articleUpdate
    ,articlelist
    ,inventoryTotal
    ,inventoryUpdate
    ,assignmentRevoke
    ,returnArticleArray
    ,inventoryGet
    ,currentArticleStock
};