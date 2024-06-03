const express =require ('express');
const router= express.Router();
const panel=require('../controllers/panel.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/panel/mEnu/GeT/:RolE',forceBrute.notBruteSecure,auth.autorizedRole(['*']), panel.getAllPanel); // Registro de cuentas de usuario

module.exports=router;