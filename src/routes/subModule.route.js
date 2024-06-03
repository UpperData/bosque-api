const express =require ('express');
const router= express.Router();
const subModulo=require('../controllers/submodule.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/fRONT/submOdule/GET/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), subModulo.getSubModule); // retorna subModulos
router.post('/admIn/subMOdule/CreaTE/',forceBrute.notBruteSecure,auth.autorizedRole([5]), subModulo.createSubModule); // agrega subModulos
router.put('/ADMIn/sUBModuLe/UPDatE/',forceBrute.notBruteSecure,auth.autorizedRole([5]), subModulo.editSubModule); // actualizar subModulos
router.get('/AdmIn/sUBModuLe/permisSIon/:subModuleId',forceBrute.notBruteSecure,auth.autorizedRole([5]), subModulo.getPermissionBySubModule);//Retorna permisos de un sub modulo
module.exports=router;
