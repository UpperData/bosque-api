const express =require ('express');
const router= express.Router();
const grant=require('../controllers/grantRole.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.post('/AdmIn/grANTROle/adD',forceBrute.notBruteSecure,auth.autorizedRole([5]), grant.addGrantRole); // agrega permisos a un role

module.exports=router;