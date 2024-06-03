const express =require ('express');
const router= express.Router();
const changeType=require('../controllers/changeType.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');

router.post('/change/Type/add',forceBrute.notBruteSecure,auth.autorizedRole(['5']), changeType.createChangeType); // Regsitra tipo de cambio
router.get('/change/Type/get/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), changeType.getChangeType); // optiene tipo de cambio
router.get('/change/Type/current',forceBrute.notBruteSecure,auth.autorizedRole(['*']), changeType.getCurrentChangeType); // optiene tipo de cambio

module.exports=router;