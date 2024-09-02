const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
const generals=require('./generals.ctrl');
var moment=require('moment');
var fs = require("fs");
const Excel = require("exceljs");
var path = require("path");

async function downloadInventorySheet(req, res) {
    
    try {
      var workbook = new Excel.Workbook();
      var worksheet = workbook.addWorksheet();
  
      worksheet.columns = [
        { header: "Id", key: "id", width: 10 },
        { header: "Name", key: "name", width: 32 },
        { header: "D.O.B.", key: "DOB", width: 10 }
      ];
      worksheet.addRow({ id: 1, name: "John Doe", DOB: new Date(1970, 1, 1) });
      worksheet.addRow({ id: 2, name: "Jane Doe", DOB: new Date(1965, 1, 7) });
  
      workbook.xlsx
        .writeFile("newSaveeee.xlsx")
        .then(response => {
          console.log("file is written");
          console.log(path.join(__dirname, "../newSaveeee.xlsx"));
          console.log(path.join(__dirname, "../newSaveeee.xlsx"));
          res.sendFile(path.join(__dirname, "..\newSaveeee.xlsx"));
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log("OOOOOOO this is the error: " + err);
    }
};


async function inventoryArticle(req,res){ // optiene el inventario actual, hoja de inventario
    const {articleId} =req.params;   
    console.log(req.params) ;
    await model.article.findAll({
        attributes:['id','name','description','isActived','price','minStock','isPublished'],        
        where:{id:articleId},
        include:[{            
            model:model.lots,
                attributes:{exclude:['audit','createdAt','updatedAt']},
                where:{isActived:true},
                required:true,
                include:[{    
                    model:model.itemLot,
                        attributes:{exclude:['audit','createdAt','updatedAt']},
                        where:{conditionId:1},
                    required:true

                }]
        }],
        order:['name','isActived'],
        raw:true
    }).then(async function(rsInventory){
        for (let index = 0; index < rsInventory.length; index++) {
            rsInventory[index].numOrder=index+1;
            rsInventory[index].weightPrice=parseFloat( rsInventory[index].price)* parseFloat(rsInventory[index]['lots.itemLots.weight']);            
        }        
        res.status(200).json({"result":true,"data":rsInventory});          
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando inventario"}});  
    })
}


async function assignmentArticle(articleId,conditionId){  
    try{
        rsAssignmet= await model.shoppingCar.findAndCountAll({            
            include:[{
                model:model.itemLot,
                attributes:['id','weight'],
                where:{ conditionId},
                required:true,                    
                include:[{
                    model:model.lots,                    
                        attributes:['id'] ,                   
                        where:{isActived:true}, 
                        required:true,                       
                        include:[{
                            model:model.article,
                            where:{id:articleId,isActived:true},
                            attributes:['id','name','description','isSUW'],
                            required:true
                        }]
                }]
            }],nest: true
        }); 
        
        if(rsAssignmet.count>0){
            
            if(rsAssignmet.rows[0].itemLot.lot.article.isSUW){            
                return rsAssignmet.count + " uds."; 
            }else{              
                // sumar los pesos
                rsTotalWeight=0;
                for (let index = 0; index < rsAssignmet.count; index++) {
                    rsTotalWeight += parseFloat(rsAssignmet.rows[index].dispatch)                   
                }
                return rsTotalWeight + ' kg';
       }
       }else{
        return ('-');
       }
    }catch(error){
        console.log(error);
        return ('-');
    }   
      
    
}

async function currentArticleStock(articleId,conditionId){
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
                        where:{ conditionId},
                        required:true
                    }]
            }],nest: true
        });         
       if(rsStock.count>0){
            if(rsStock.rows[0].isSUW){            
                return rsStock.count + " uds."; 
            }else{              
                return rsStock.rows[0].lots[0].itemLots[0].weight+ " kg"; 
            }
       }else{
        return ('-');
       }
        
    }
    catch(error){
        console.log(error);        
        return ('-')
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
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    const t = await model.sequelize.transaction();  
    let audit=[]   
    const toDay=moment(); 
    audit.push({
        "action":"Creo nuevo articulo -> "+name ,// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":req.body
    }); 
    
    var maxArticle=await model.sequelize.query("SELECT max(id) + 1 as proximo from articles");    
    await model.article.create({id:maxArticle[0][0].proximo,name,description,minStock,image,price,isSUW,audit},{transaction:t},{returning: true}).
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
    const{id,name,description,isActived,price,minStock,image,isSUW,isPublished}=req.body;
    const t=await model.sequelize.transaction();
    await model.article.update({name,description,isActived,price,minStock,image,isSUW,isPublished},{where:{id}},{transaction:t}).then(async function(rsArticle){
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
            attributes:['id','name','description','price','image','minStock','isSUW','isActived','isPublished'],
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
            attributes:['id','name','description','price','image','minStock','isSUW','isActived','isPublished'],
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
            attributes:['id','name','description','minStock','price','image','isSUW','isPublished'],
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
            attributes:['id','name','description','minStock','price','image','isSUW','isPublished'],
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
        attributes:['id','name','description','isActived','isSUW','price','minStock','isPublished','image','smallImage'],        
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
            rsInventory[index].dataValues.asignados=0;
            
            rsInventory[index].dataValues.almacen= await currentArticleStock(rsInventory[index].dataValues.id,1);
            rsInventory[index].dataValues.asignados=await assignmentArticle(rsInventory[index].dataValues.id,2);;
            rsInventory[index].dataValues.dolarValue=parseFloat(rsInventory[index].price).toFixed(2); //agrega precio en dolares segun el valor actual
            totalPriceInventory=totalPriceInventory+( parseFloat(rsInventory[index].price).toFixed(2) * 
                            parseFloat(rsInventory[index].dataValues.almacen=='-'?0:rsInventory[index].dataValues.almacen).toFixed(2));
            console.log("Precio:"+ parseFloat(rsInventory[index].price).toFixed(2));
            console.log("Cantidad:"+ parseFloat(rsInventory[index].dataValues.almacen).toFixed(2));
        }    
        //rsInventory.push({bolivaresTotalInventory:totalPriceInventory.toFixed(2)});
        //rsInventory.push({dolarTotalInventory:Number(totalPriceInventory/dolar).toFixed(2)});     
        res.status(200).json({"items":rsInventory,dolarTotalInventory:Number(totalPriceInventory).toFixed(2)});          
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
    ,inventoryArticle
    ,downloadInventorySheet

};