const { attachment } = require('express/lib/response');
const model=require('../db/models/index');
const { Op } = require("sequelize");

async function userWithOrders(req,res){
    await model.account.findAndCountAll({
        attributes:['id','people', 'phone','name'],
        include:[{
            model:model.shoppingCar,
                attributes:['id'],
                required:true,

        }]
    }).then(async function(rsClientes){
        res.status(200).json({"result":true,"data":rsClientes});    
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});  
    })
}
async function pendinOrders(req,res){
    const {accountId} =req.params;
    await model.shoppingCar.findAndCountAll({
        attributes:['id', 'qty','dispatch'],
        where:{orderStatusId:{
            [Op.lte]: 3
        }},
        include:[
            {
                model:model.account,
                attributes:['id', 'phone','name'],
                where:{ ...(accountId>0 && {
                    id:accountId})},
                required:true
            },
            {
                model:model.orderStatus,
                attributes:['id','name'],
                required:true
            } ,
            {
                model:model.itemLot,
                attributes:['id', 'weight'],
                required:true,
                 include:[{
                    model:model.lots,
                    attributes:['id'],
                    required:true,
                    include:[{
                        model:model.article,
                        attributes:['id','name','isSUW'],
                        required:true
                    }]
                }] 
            } 
        ],
        raw:true
    }).then(async function(rsSales){
        res.status(200).json({"result":true,"data":rsSales});    
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});  
    })
}

module.exports={pendinOrders,userWithOrders}