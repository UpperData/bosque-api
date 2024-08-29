const model=require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken=require('./serviceToken.ctrl');
const generals=require('./generals.ctrl');
var moment=require('moment');
async function getPublishing(req,res){    
    const {articleId}=req.params;
    //const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));     
    if(articleId!='*'){
        //Busca inventario de un articulo
        return await model.inventory.findOne({            
            where:{articleId,isPublished:true},
            include:[{
                model:model.article,
                attributes:{exclude:['isActived','createdAt','updatedAt','doctorId']},
            }]
        }).then(async function(rsPublishing){
            if(rsPublishing){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){ 
            console.log(error);           
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }else{
        //Busca todos el inventario de una tienda
        return await model.inventory.findAll({where:{articleId,isPublished:true},order:['updatedAt']})
        .then(async function(rsPublishing)
        {            
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});
        }).catch(async function(error){    
            console.log(error)        
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    } 
}
async function setPublishing(req,res){
    const {articleId,isPublished}=req.body
    const t= await model.sequelize.transaction();
    const dataToken=await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', '')); 
    let audit=[]   
    const toDay=moment(); 
    audit.push({
        "action":isPublished?"Publico":"dio de baja"+ articleId ,// que accion se realizó
        "people":dataToken.people.document,// quien la realizo (Nombre)
        "account":dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values":{"status":isPublished,"article":articleId}
    }); 
    return await model.article.update({isPublished},{where:{id:articleId}},{transaction:t})
    .then(async function(rsPublishing){
        await t.commit();                     
        if(isPublished){ // notifica nuevos productos disponible
            await model.accountRole.findAll({where:{roleId:5}}) // roles de clientes
            .then(async function(rsRole){                    
                for (let index = 0; index < rsRole.length; index++) {
                    const l= await model.sequelize.transaction();
                    console.log(rsRole[index].accountId)
                    try{
                        await model.notification.create({
                            accountId: rsRole[index].accountId,
                            from: "Bosque Marino",
                            read: false,
                            body: {"message":"Nuevos productos disponibles", "link":"#","img":""}
                        },{transaction:l})
                        l.commit();
                    }catch(error){
                        console.log(error);
                        l.rollback();
                    }                        
                }
                res.status(200).json({"data":{"result":true,"message":"Artículo publicado","data":rsPublishing}});        
            })
        }else{
                
            res.status(200).json({"data":{"result":true,"message":"Artículo de baja","data":rsPublishing}});        
        }
            
                 
    }).catch(async function(error){            
        console.log(error)
        await t.rollback();  
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});        
    })
   
}

async function getPublishingCategory(req,res){    
    const {categoryId}=req.params;        
    if(categoryId!='*'){
        //Busca inventario de un articulo
        return await model.inventory.findAndCountAll({            
            where:{category:{
                categoryId
            }},
            limit:500
        }).then(async function(rsPublishing){
            if(rsPublishing){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){ 
            console.log(error);           
            res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
        })
    }
}
async function getPublishingCategoryName(req,res){    
    const {category,limit,page}=req.params;   
    if(category!='*'){
        //Busca inventario de un articulo
        return await model.inventory.findAndCountAll({            
            where:{
                isPublished:true,
                category:
                {                   
                    category                                    
            }},
            include:[{
                model:model.article,
                attributes:{exclude:['updatedAt','createdAt']}
            }],
            limit:parseInt(limit),
            offset:(parseInt(page) * (limit))
        }).then(async function(rsPublishing){
            if(rsPublishing){
                res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
            }else{
                res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
            }            
        }).catch(async function(error){ 
            console.log(error);           
            res.status(403).json({"data":{"result":false,"message":error.message}});        
        })
    }
}
async function getPublishingClass(req,res){    
    const {autoTypeId}=req.params;  
    //Busca inventario de un articulo
    return await model.inventory.findAndCountAll({            
        where:{autoTypeId},
        limit:2000
    }).then(async function(rsPublishing){
        if(rsPublishing){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
        }            
    }).catch(async function(error){ 
        console.log(error);           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })   
}
async function getPublishingSubCategory(req,res){    
    const {subCategoryId}=req.params;  
    //Busca inventario de un articulo
    return await model.inventory.findAndCountAll({            
        where:{
            category:{
            subCategory:subCategoryId
            },
            isPublished:true
        },
        limit:2000
    }).then(async function(rsPublishing){
        if(rsPublishing){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
        }            
    }).catch(async function(error){ 
        console.log(error);           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })   
}
async function getPublishingFull(req,res){    
    const {limit,page}=req.params;  
    console.log(req.params)
    //Busca inventario de un articulo
    return await model.inventory.findAndCountAll({            
        where:{isPublished:true},
        limit:parseInt(limit),
        offset:(parseInt(page) * (limit))
    }).then(async function(rsPublishing){
        if(rsPublishing){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
        }            
    }).catch(async function(error){ 
        console.log(error);           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })   
}
async function getPublishingSubCategoryAndText(req,res){    // busca lo escriba el usuario en una categoria
    const {subCategoryId,textValue,limit,page}=req.params;  
    //Busca inventario de un articulo
    return await model.inventory.findAndCountAll({            
        where:{
            category:{
            subCategory:subCategoryId
            },
            isPublished:true,
            description:{
                [Op.iLike]: textValue
            }
        },
        limit:parseInt(limit),
        offset:(parseInt(page) * (limit))
    }).then(async function(rsPublishing){
        if(rsPublishing){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
        }            
    }).catch(async function(error){ 
        console.log(error);           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })   
}
async function getPublishingByShopSeven(req,res){  //últimas 7 publicaciones de una tienda  
    const {shop}=req.params;    
        //Busca inventario de un articulo
    return await model.inventory.findAll({            
        where:{isPublished:true},
        include:[{
            model:model.article,
                atributtes:['id'],
                where:{storeId:shop}
        }],
        order:['updatedAt'],
        limit:7
    }).then(async function(rsPublishing){
        if(rsPublishing){
            res.status(200).json({"data":{"result":true,"message":"Busqueda satisfatoria","data":rsPublishing}});        
        }else{
            res.status(403).json({"data":{"result":false,"message":"No existe registro con este código"}});            
        }            
    }).catch(async function(error){ 
        console.log(error);           
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal buscando registro"}});        
    })    
}
module.exports={getPublishing,
    setPublishing,
    getPublishingCategory,
    getPublishingClass,
    getPublishingSubCategory,
    getPublishingFull,
    getPublishingSubCategoryAndText,
    getPublishingByShopSeven,
    getPublishingCategoryName
};