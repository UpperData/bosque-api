const express =require ('express');
const router= express.Router();
const inventory=require('../controllers/inventory.ctrl');
const lots=require('../controllers/lots.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.post('/inVeNtOrY/aSSgNMEnt/New',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentNew); // Asigna medicamento a un medico
router.get('/invENtOrY/aSSGNmEnT/byDoCTOR/:accountId',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentByDoctor); // obtienes asignaciones por doctor
router.put('/invENtOrY/asSGNmEnT/UPDATE',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentUpdate); // Actualiza asignación

//aRTICLES
router.post('/INVETOry/aricle/new',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.articleNew);//Registra producto
router.put('/InVETOrY/aricLe/EdIT',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.articleUpdate);//actualiza un articulo 
router.get('/InVETorY/aRIcLe/list/:id',forceBrute.notBruteSecure,inventory.articlelist);//obtiene uno/todos los articulo 

// Inventario
router.get('/Inventory/get/:articelId/:isArtActived/:isLotActived/:conditionId',forceBrute.notBruteSecure,inventory.inventoryGet) // Obtiene invetario de productos
router.get('/InveTorY/get/ALL',forceBrute.notBruteSecure,auth.autorizedRole(['*']),inventory.inventoryTotal);//obtiene inventario actula
router.put('/InvEToRY/UpdaTE/ARTICLE',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.inventoryUpdate);//actualiza inventario 
router.get('/InvEToRY/revoke/assignament/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.assignmentRevoke);//revocar asignación
router.get('/INVETORY/articles/*',forceBrute.notBruteSecure,inventory.returnArticleArray); // Retorna arreglo de articulos del carriro)
router.get('/INVETORY/get/Article/:articleId',forceBrute.notBruteSecure,inventory.inventoryArticle); // Retorna inventario por articulo
// Lotes
router.post('/inVenTory/LOTS',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.lotCreate);
router.get('/inVenTory/LotS/:articleId/:isActived',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.lotArticle);
router.put('/inVenTory/LotS/',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.lotEdit);
 // Items lot
router.post('/inVenTory/LotS/ITEMS',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.itemLotCreate);
router.put('/inVenTory/LotS/ITEMS',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.itemLotupdate);
router.get('/inVenTory/LotS/ITEMS/fInd/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']),lots.itemLotFind);
router.get('/Inventory/Itemlot/true/:articleId',forceBrute.notBruteSecure,lots.itemLotByArticle);
router.get('/Inventory/Itemlot/:lotId',forceBrute.notBruteSecure,lots.itemByLot); //
router.get('/Inventory/currentNumItem/:articleId',forceBrute.notBruteSecure,lots.currentItemNum); //


// Stock
router.get('/Inventory/stock/art/:articleId',forceBrute.notBruteSecure,inventory.stockByArticle);
router.get('/Inventory/stock/download/:articleId',forceBrute.notBruteSecure,inventory.downloadInventorySheet);
router.get('/Inventory/stock/ARTi/ALl',forceBrute.notBruteSecure,inventory.articleOnStockList);
module.exports=router;