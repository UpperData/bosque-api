const express =require ('express');
const router= express.Router();
const admin=require('../controllers/admin.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/accOunT/passWord/ReSeT/:email',forceBrute.notBruteSecure,auth.autorizedRole([5]),admin.passwordResetEnable); // 
router.get('/accOunT/aCcOUNT/ACTIVaTE/:email',forceBrute.notBruteSecure,auth.autorizedRole([5]),admin.activateAccount); // 
router.get('/ACCount/ENaBLed/to/RESTAR',forceBrute.notBruteSecure,auth.autorizedRole([5]),admin.getAccountWithToken); //Obtiene datos cuentas on yoken habilitado
router.get('/AcCoUnt/GET/ROLE/byAccoUnT/:accountId',forceBrute.notBruteSecure,auth.autorizedRole([5]),admin.getRoleByAccount); //Obtieneroles de una cuenta
router.get('/AcCoUNT/GET/REvOKE/paSSwoRD/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]),admin.passwordResetRevoke); //Revoka token para restaturar password
module.exports=router;