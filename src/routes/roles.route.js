const express =require ('express');
const router= express.Router();
const role=require('../controllers/role.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/front/Role/get/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), role.getRole); // consulta roles
router.post('/admin/rOle/CREATE',forceBrute.notBruteSecure,auth.autorizedRole([5]), role.createRole); //Crea un role
router.put('/adMin/rOLE/updatE',forceBrute.notBruteSecure,auth.autorizedRole([5]), role.editRole); //actualiza un role
module.exports=router;
