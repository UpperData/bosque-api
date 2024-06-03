const express =require ('express');
const router= express.Router();
const inventory=require('../controllers/inventory.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.post('/inVeNtOrY/aSSgNMEnt/New',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentNew); // Asigna medicamento a un medico
router.get('/invENtOrY/aSSGNmEnT/byDoCTOR/:accountId',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentByDoctor); // obtienes asignaciones por doctor
router.put('/invENtOrY/asSGNmEnT/UPDATE',forceBrute.notBruteSecure,auth.autorizedRole([5]), inventory.assignmentUpdate); // Actualiza asignación
router.post('/INVETOry/aricle/new',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.articleNew);//Registra producto
router.put('/InVETOrY/aricLe/EdIT',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.articleUpdate);//actualiza un articulo 
router.get('/InVETorY/aRIcLe/list/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']),inventory.articlelist);//obtiene uno/todos los articulo 
router.get('/InveTorY/get/ALL',forceBrute.notBruteSecure,auth.autorizedRole(['*']),inventory.inventoryTotal);//obtiene inventario actula
router.put('/InvEToRY/UpdaTE/ARTICLE',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.inventoryUpdate);//actualiza inventario 
router.get('/InvEToRY/revoke/assignament/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]),inventory.assignmentRevoke);//revocar asignación
router.get('/INVETORY/articles/*',forceBrute.notBruteSecure,inventory.returnArticleArray) // Retorna arreglo de articulos del carriro)

module.exports=router;