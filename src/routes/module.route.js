const express =require ('express');
const router= express.Router();
const modulo=require('../controllers/module.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/fRONT/MODUle/GET/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), modulo.getModule); // retorna modulos
router.post('/admIn/ModuLe/GeT/',forceBrute.notBruteSecure,auth.autorizedRole([5]), modulo.createModule); // agrega modulos
router.put('/aDmIn/MoDuLe/UPdatE/',forceBrute.notBruteSecure,auth.autorizedRole([5]), modulo.editModule); // actualizar modulos 
router.get('/aDmIn/MoDuLe/submodUle/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]), modulo.subModuleFromModule); // actualizar modulos 
module.exports=router;
