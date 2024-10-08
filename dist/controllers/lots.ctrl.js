const model = require('../db/models/index');
const { Op } = require("sequelize");
const serviceToken = require('./serviceToken.ctrl');
const generals = require('./generals.ctrl');
var moment = require('moment');

async function currentItemNum(req, res) {
    // retornar ultimo y sigueinte numero de item 
    const { articleId } = req.params;
    await model.itemLot.findOne({
        attributes: [[model.sequelize.fn('MAX', model.sequelize.col('numItem')), 'numItem']],
        include: [{
            model: model.lots,
            attributes: ['id'],
            where: { isActived: true, articleId },
            required: true,
            include: [{
                model: model.article,
                attributes: ['id'],
                required: true,
                where: {
                    id: articleId
                }

            }]
        }], group: ['lot.id', 'lot->article.id'],
        raw: true
    }).then(async function (rsItemNum) {
        if (!rsItemNum) {
            rsItemNum = {};
            rsItemNum.numItem = 0;
        } // primer item        
        console.log(rsItemNum);
        data = { "currentItem": parseInt(rsItemNum.numItem), "nextItem": parseInt(rsItemNum.numItem) + 1 };
        res.status(200).json({ "result": true, data });
    }).catch(async function (error) {
        console.log(error);
        res.status(403).json({ data: { "result": false, "message": error.message } });
    });
}

async function itemLotRelease(req, res) {
    // edita un nuevo lote de articulos
    const { id, lotId } = req.body;
    const dataToken = await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    let audit = [];
    const toDay = moment().format('lll');
    audit.push({
        "action": "Libero item " + id, // que accion se realizó
        "people": dataToken.people.document, // quien la realizo (Nombre)
        "account": dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values": { items, lotId }
    });
    const t = await model.sequelize.transaction();
    await model.itemLot.update({ conditionId: 6, audit }, { where: { id } }, { transaction: t }).then(async function (rsItemsLot) {

        t.commit();
        res.status(200).json({ data: { "result": true, "message": "Pedido liberado" } });
    }).catch(async function (error) {
        t.rollback();
        res.status(403).json({ data: { "result": false, "message": error.message } });
    });
}
async function itemByLot(req, res) {
    const { lotId } = req.params;
    await model.itemLot.findAll({
        attributes: { exclude: ['audit'] },
        where: { lotId },
        include: [{
            model: model.condition,
            attributes: ['name'],
            order: [['id', 'DESC']]
        }],
        order: [['createdAt', 'DESC']],
        raw: true

    }).then(async function (rsItemLot) {
        res.status(200).json({ "result": true, "data": rsItemLot });
    }).catch(async function (error) {
        res.status(403).json({ "result": false, "message": error.message });
    });
}
async function itemLotByArticle(req, res) {
    // trar lote DISPONIBLES
    const { articleId } = req.params;
    await model.itemLot.findAll({
        attributes: { exclude: ['lotId', 'audit', 'createdAt', 'updatedAt'] },
        where: { conditionId: 1 },
        include: [{
            model: model.lots,
            attributes: ['id'],
            where: { isActived: true },
            include: [{
                model: model.article,
                attributes: ['price', 'isSUW'],
                where: { id: articleId, isActived: true }
            }]
        }],
        raw: true
    }).then(async function (rsItemsLot) {
        res.status(200).json({ "result": true, "data": rsItemsLot });
    }).catch(async function (error) {
        res.status(403).json({ "result": false, "message": error.message });
    });
}

async function itemLotFind(req, res) {
    // traer items 
    const { id } = req.params;
    await model.itemLot.findByPk(id).then(async function (rsItemsLot) {

        res.status(200).json({ data: { "result": true, "data": rsItemsLot } });
    }).catch(async function (error) {
        console.log(error);
        res.status(403).json({ data: { "result": false, "message": error.message } });
    });
}

async function itemLotupdate(req, res) {
    // edita un nuevo lote de articulos
    const { items, id, lotId, articleId } = req.body;
    console.log("req.body");
    console.log(req.body);
    const dataToken = await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    let audit = [];
    const toDay = moment().format('lll');
    audit.push({
        "action": "Editó item " + id, // que accion se realizó
        "people": dataToken.people.document, // quien la realizo (Nombre)
        "account": dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values": { items, lotId }
    });
    let insert_items = 0;
    const t = await model.sequelize.transaction();
    if (items.length > 0) {
        for (let index = 0; index < items.length; index++) {
            await model.lots.findOne({ // busca un el numero de item para lotes de una especie
                where: { isActived: true, articleId },
                include: [{
                    model: model.itemLot,
                    where: {
                        numItem: items[index].numItem
                    }
                }],
                raw: true
            }).then(async function (rsNumValid) {
                if (rsNumValid) {
                    if (rsNumValid['itemLots.numItem'] == items[index].numItem) {
                        // es mi propio registro
                        await model.itemLot.update({
                            weight: items[index].weight,
                            conditionId: items[index].conditionId,
                            note: items[index].note,
                            audit
                        }, { where: { id } }, { transaction: t }).then(async function (rsItemsLot) {
                            insert_items++;
                        }).catch(async function (error) {
                            console.log(error);
                            t.rollback();
                            res.status(403).json({ data: { "result": false, "message": error.message } });
                        });
                    } else {
                        res.status(200).json({ data: { "result": false, "message": "Número pertenece a otro Item" } });
                    }
                } else {
                    await model.itemLot.update({
                        weight: items[index].weight,
                        conditionId: items[index].conditionId,
                        note: items[index].note,
                        audit,
                        numItem: items[index].numItem
                    }, { where: { id } }, { transaction: t }).then(async function (rsItemsLot) {
                        insert_items++;
                    }).catch(async function (error) {
                        console.log(error);
                        t.rollback();
                        res.status(403).json({ data: { "result": false, "message": error.message } });
                    });
                }
            }).catch(async function (error) {
                console.log(error);
                t.rollback();
                res.status(403).json({ data: { "result": false, "message": error.message } });
            });
        }
        if (insert_items) {
            t.commit();
            res.status(200).json({ data: { "result": true, "message": "Item actualizado" } });
        }
    } else {
        t.rollback();
        res.status(403).json({ data: { "result": false, "message": "Ingrese valores del item en el lote" } });
    }
}
async function itemLotCreate(req, res) {
    // crea un nuevo item en un lote
    const { items, lotId } = req.body;
    const dataToken = await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    let audit = [];
    const toDay = moment().format('lll');
    audit.push({
        "action": "Creó nuevo item en el lote " + lotId, // que accion se realizó
        "people": dataToken.people.document, // quien la realizo (Nombre)
        "account": dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values": { items, lotId }
    });

    const newItem = async () => {
        const t = await model.sequelize.transaction();
        let insert_items = 0;
        let numItem = null;
        await model.itemLot.max('numItem', { where: { lotId } }) //obtiene el item mayor
        .then(async function (rsLotItemNum) {
            numItem = rsLotItemNum;
            if (!rsLotItemNum) {
                numItem = 0;
            }
            if (items.length > 0) {
                for (let index = 0; index < items.length; index++) {
                    //valida que iten no pertenece a otro item activo

                    await model.itemLot.create({
                        lotId,
                        weight: items[index].weight,
                        conditionId: items[index].conditionId,
                        note: items[index].note,
                        numItem: items[index].numItem ? items[index].numItem : numItem + 1,
                        audit }, { transaction: t }).then(async function (rsItemsLot) {

                        insert_items++;
                    }).catch(async function (error) {
                        t.rollback();
                        console.log(error);
                    });
                }
                if (insert_items) {
                    t.commit();
                }
            } else {
                t.rollback();
                console.log(error);
            }
        });
    };

    await model.lots.findOne({
        include: [{
            model: model.article,
            attributes: ['id', 'isActived', 'isSUW'],
            where: { isActived: true },
            required: true
        }],
        where: { id: lotId },
        raw: true
    }).then(async function (rsLotArticle) {
        if (rsLotArticle) {
            //si el artículo del lote está activo
            if (rsLotArticle['article.isSUW']) {
                //si se vende por unidad

                newItem(); //Registrar Item
                res.status(200).json({ data: { "result": true, "message": "Item registrado" } });
            } else {
                // si se vende por peso
                await model.itemLot.findOne({ where: { lotId } }).then(async function (rsItem) {
                    if (!rsItem) {
                        // si es in lote sin Items
                        newItem(); //Registrar Item
                        res.status(200).json({ data: { "result": true, "message": "Item registrado" } });
                    } else {
                        // si es un lote con Items
                        res.status(200).json({ data: { "result": false, "message": "Solo puede tener un Item para artículo a granel" } });
                    }
                });
            }
        } else {
            //si el artículo no esta activo
            res.status(200).json({ data: { "result": false, "message": "El artículo debe estar activo" } });
        }
    });
}

async function lotEdit(req, res) {
    const { articleId, receivedDate, expDate, isActived, note, lotId } = req.body;
    console.log(req.body);
    const dataToken = await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    let audit = [];
    const toDay = moment().format('lll');
    audit.push({
        "action": "Modifica encabezado de lote " + lotId, // que accion se realizó
        "people": dataToken.people.document, // quien la realizo (Nombre)
        "account": dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values": { articleId, receivedDate, expDate, isActived, note }
    });
    const lotEdit = async () => {
        const t = await model.sequelize.transaction();
        await model.lots.findByPk(lotId).then(async function (rsLot) {
            rsLot.audit.push(audit);
            await model.lots.update({ articleId, receivedDate, expDate, isActived, note, audit: rsLot.audit }, { where: { id: rsLot.id } }, { transaction: t }).then(async function (rsLotEdit) {
                t.commit();
            }).catch(async function (error) {
                console.log(error);
                t.rollback();
            });
        }).catch(async function (error) {
            console.log(error);
            t.rollback();
            res.status(403).json({ data: { "result": false, "message": "Algo salió mal editando lote, intente nuevamente" } });
        });
    };

    await model.article.findOne({ where: { id: articleId, isActived: true } }) //Valida articulo activo
    .then(async function (rsAticle) {
        if (rsAticle) {
            // Si el articulo esta activo
            await model.lots.findOne({ where: { articleId: rsAticle.id, isActived: true } }) //Valida lotes activos del articulo
            .then(async function (rsLotValidate) {
                if (!rsLotValidate) {
                    // si no hay lotes activos                     
                    lotEdit(); // edita lote
                    res.status(200).json({ data: { "result": true, "message": "Lote # " + lotId + " actualizado" } });
                } else {
                    // Si hay lote activo
                    if (rsAticle.isSUW) {
                        // si la venta es por peso unitario
                        lotEdit(); // registrar lote
                        res.status(200).json({ data: { "result": true, "message": "Lote # " + lotId + "  actualizado" } });
                    } else {
                        // si el producto se vende por peso
                        if (isActived) {
                            res.status(200).json({ data: { "result": false, "message": "Ya tiene un lote activo para este artículo" } });
                            // No edita, solo puede tener un lote activo para producto de venta por peso
                        } else {
                            lotEdit(); // registrar lote inactivo
                            res.status(200).json({ data: { "result": true, "message": "Lote # " + lotId + "  actualizado" } });
                        }
                    }
                }
            }).catch(async function (error) {
                console.log(error);
                res.status(403).json({ data: { "result": false, "message": "Algo salió mal, intente nuevamente" } });
            });
        } else {
            // Si articulo esta Inactivo
            res.status(200).json({ data: { "result": false, "message": "Active el artículo para poder agregar lotes" } });
        }
    });
}
async function lotArticle(req, res) {
    const { articleId, isActived } = req.params;
    //if (typeof (isActived) === "boolean") {}
    await model.lots.findAll({
        attributes: { exclude: ['audit', 'createdAt', 'updatedAt'] },
        where: {
            articleId,
            isActived
        },
        order: [['isActived', 'DESC'], ['receivedDate', 'DESC']],
        include: [{
            model: model.itemLot,
            attributes: { exclude: ['audit', 'createdAt', 'updatedAt'] }

        }]
    }).then(async function (rsLots) {
        if (rsLots) {
            //rsLots[i].qty=0;
            for (let i = 0; i < rsLots.length; i++) {
                rsLots[i].dataValues.qty = rsLots[i].itemLots.length;

                for (let index = 0; index < rsLots[i].itemLots.length; index++) {
                    await model.condition.findOne({
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        where: { id: rsLots[i].itemLots[index].conditionId }
                    }).then(async function (rsCondition) {
                        rsLots[i].itemLots[index].dataValues.conditionName = rsCondition.name;
                    });
                }
            }
        }
        res.status(200).json({ data: { "result": true, "data": rsLots } });
    }).catch(async function (error) {
        console.log(error);
        res.status(403).json({ data: { "result": false, "message": "Algo salió mal, intente nuevamente" } });
    });
}
async function lotCreate(req, res) {
    // crea un nuevo lote de articulos
    const { articleId, receivedDate, expDate, isActived, note, items } = req.body;
    console.log("req.body");
    console.log(req.body);
    const dataToken = await serviceToken.dataTokenGet(req.header('Authorization').replace('Bearer ', ''));
    let audit = [];
    const toDay = moment().format('lll');
    audit.push({
        "action": "Creó nuevo lote", // que accion se realizó
        "people": dataToken.people.document, // quien la realizo (Nombre)
        "account": dataToken.account, //  quien la realizó (cuenta de usuario)
        "moment": toDay, //  cuando la realizó (Fecha hora)
        "values": { articleId, receivedDate, expDate, isActived, note, items }
    });
    const lotNew = async () => {
        const t = await model.sequelize.transaction();
        await model.lots.create({ articleId, receivedDate, expDate, isActived, note, audit }, { transaction: t }).then(async function (rslot) {
            let insert_items = 0;
            if (items.length > 0) {
                // Registra Items
                for (let index = 0; index < items.length; index++) {
                    await model.itemLot.create({ lotId: rslot.id, weight: items[index].weight, conditionId: items[index].conditionId, note: items[index].note, itemLot: index + 1, audit }, { transaction: t }).then(async function (rsItemsLot) {

                        insert_items++;
                    }).catch(async function (error) {
                        console.log(error);
                        t.rollback();
                    });
                }
                if (insert_items == items.length) {
                    t.commit();
                }
            } else {
                // no regsitra item y da respuesta
                t.commit();
            }
        }).catch(async function (error) {
            t.rollback();
            console.log(error);
            // res.status(403).json({data:{"result":false,"message":error.message}});
        });
    };
    await model.article.findOne({ where: { id: articleId, isActived: true } }) //Valida articulo activo
    .then(async function (rsAticle) {

        if (rsAticle) {
            // Si el articulo esta activo
            await model.lots.findOne({ where: { articleId: rsAticle.id, isActived: true } }) //Valida lotes activos del articulo
            .then(async function (rsLotValidate) {
                if (!rsLotValidate) {
                    // si no hay lotes activos                     
                    lotNew(); // registra lote
                    res.status(200).json({ data: { "result": true, "message": "Lote registrado" } });
                } else {

                    if (rsAticle.isSUW) {
                        // si la venta es por peso unitario
                        lotNew(); // registrar lote
                        res.status(200).json({ data: { "result": true, "message": "Lote registrado" } });
                    } else {
                        // si el producto se vende por peso
                        res.status(200).json({ data: { "result": false, "message": "Ya tiene un lote activo para este articulo" } });
                        // No registrar, solo puede tener un lote activo para producto de venta por peso
                    }
                }
            }).catch(async function (error) {
                console.log(error);
                res.status(403).json({ data: { "result": false, "message": "Algo salió mal, intente nuevamente" } });
            });
        } else {
            // Si articulo esta Inactivo
            res.status(200).json({ data: { "result": false, "message": "Active el artículo para poder agregar lotes" } });
        }
    }).catch(async function (error) {
        console.log(error);
        res.status(403).json({ data: { "result": false, "message": "Algo salió mal, intente nuevamente" } });
    });
}
module.exports = { lotCreate, lotArticle, lotEdit, itemLotCreate, itemLotupdate,
    itemLotFind, itemLotByArticle, itemByLot, itemLotRelease, currentItemNum };