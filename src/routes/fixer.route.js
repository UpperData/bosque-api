const express =require ('express');
const router= express.Router();
const fixer=require('../controllers/fixer.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

//router.get('/FIXer/perMissIONS/',forceBrute.notBruteSecure, fixer.fixerPermissions); // repara permisos


module.exports=router;