const { attachment } = require('express/lib/response');
const model=require('../db/models/index');
const { Op } = require("sequelize");

async function userWithOrders(req,res){
    await model.account.findAndCountAll({
        attributes:['id','people', 'phone','name'],
        include:[{
            model:model.shoppingCar,
                attributes:['id','orderStatusId'],
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
        attributes:[['id','shoppingCarId'], 'qty','dispatch','discount','finalWeigth'],
        where:{orderStatusId:1},
        include:[
            {
                model:model.account,
                attributes:['id', 'phone','name'],
                where:{id:accountId},
                required:true
            },
            {
                model:model.orderStatus,
                attributes:['id','name'],
                required:true
            } ,
            {
                model:model.itemLot,
                attributes:[['id','id'], 'weight','numItem'],
                required:true,
                //where:{conditionId:2},
                 include:[{
                    model:model.lots,
                    attributes:['id','isActived'],
                    required:true,
                    include:[{
                        model:model.article,
                        attributes:['id','name','isSUW','price','image'],
                        required:true
                    }]
                }] 
            } 
        ],
        raw:true
    }).then(async function(rsSales){        
        let total=0.0;
        for (let index = 0; index < rsSales.count; index++) {           
            if(rsSales.rows[index]["itemLot.lot.article.isSUW"]){   // weigth * precio             
                rsSales.rows[index].subTotal=parseFloat(parseFloat(rsSales.rows[index]["itemLot.lot.article.price"]).toFixed(2) * parseFloat(rsSales.rows[index]["itemLot.weight"]).toFixed(2)).toFixed(2);
                rsSales.rows[index]["itemLot.lot.article.price"]=parseFloat(rsSales.rows[index]["itemLot.lot.article.price"]).toFixed(2)
            }else{ // qty * price
                rsSales.rows[index].subTotal=parseFloat(parseFloat(rsSales.rows[index]["itemLot.lot.article.price"]).toFixed(2) * parseFloat(rsSales.rows[index].qty).toFixed(2)).toFixed(2);
            }
            total =total + parseFloat(rsSales.rows[index].subTotal);
        }
        rsSales.totalOrder=parseFloat(total).toFixed(2);
        res.status(200).json({"result":true,"data":rsSales});    
    }).catch(async function(error){
        console.log(error);
        res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}});  
    })
}

module.exports={pendinOrders,userWithOrders}