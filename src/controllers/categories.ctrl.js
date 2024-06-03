const model=require('../db/models/index');
const { Op } = require("sequelize");

async function getMainCategories(req,res){
    await model.mainCategory.findAll({attributes:{exclude:['isActived','createdAt','updatedAt']},where:{isActived:true}})
    .then(async function(rsMainCategory){
        res.status(200).json({data:{"result":true,"message":"Consulta satisfactoria","data":rsMainCategory}});
    }).catch(async function(error){
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}

async function addMainCategories(req,res){
    const {name,icon,url,isActived,order} = req.body;
    const t = await model.sequelize.transaction();
    await model.sequelize.transaction();
    await model.mainCategory.create({name,icon,url,isActived,order},{transaction:t})
    .then(async function(rsMainCategory){
        t.commit();
        res.status(200).json({data:{"result":true,"message":"Registro agregado con exito","data":rsMainCategory}});
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}
async function getSubCategories(req,res){
    const{mainCategoryId} =req.params
    await model.subCategory.findAll({attributes:{exclude:['isActived','createdAt','updatedAt']},
    where:{isActived:true,mainCategoryId},
    include:[
        {
        model:model.mainCategory,
        attributes:['id','name']
        }
    ]
    })
    .then(async function(rsResult){
        res.status(200).json({data:{"result":true,"message":"Consulta satisfactoria","data":rsResult}});
    }).catch(async function(error){
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}
async function addSubCategories(req,res){
    const {name,icon,url,isActived,order,mainCategoryId} = req.body;
    const t = await model.sequelize.transaction();
    await model.subCategory.create({name,icon,url,isActived,order,mainCategoryId},{transaction:t})
    .then(async function(rsResult){
        t.commit();
        res.status(200).json({data:{"result":true,"message":"Registro agregado con exito","data":rsResult}});
    }).catch(async function(error){
        t.rollback();
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}
async function getSubCategoriesN1(req,res){
    const{subCategoryId} =req.params
    await model.subCategoryN1.findAll({attributes:{exclude:['isActived','createdAt','updatedAt']},
    where:{isActived:true,subCategoryId}})
    .then(async function(rsResult){
        res.status(200).json({data:{"result":true,"message":"Consulta satisfactoria","data":rsResult}});
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}
async function getAllCategories(req,res){        
    await model.mainCategory.findAll({attributes:{exclude:['isActived','createdAt','updatedAt']},
    where:{isActived:true},
    include:[
        {
            model:model.subCategory,
            attributes:{exclude:['isActived','createdAt','updatedAt']},
            where:{isActived:true},
            include:[{
                model:model.subCategoryN1,
                attributes:{exclude:['isActived','createdAt','updatedAt']},
                where:{isActived:true}
            }]            
        }
    ]}).then(async function(rsResult){
        res.status(200).json({data:{"result":true,"message":"Consulta satisfactoria","data":rsResult}});
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({data:{"result":false,"message":error.message}})
    })
}

module.exports={
    getMainCategories, // obtienes categorias activas
    addMainCategories, // agrega una nueva categoria
    getSubCategories, //obtiene subcategoria de una categoria principal
    addSubCategories, //
    getSubCategoriesN1,
    getAllCategories// obtienes arbol de categorias
}