const express =require ('express');
const router= express.Router();
const account=require('../controllers/account.ctrl');
const serviceToken = require('../controllers/serviceToken.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.post('/loGin/byUSErpAss',forceBrute.notBruteSecure,account.loginAccount); // Autenticación de usuario
//router.post('neWTOKEN',forceBrute.notBruteSecure,serviceToken.newToken);

module.exports=router;