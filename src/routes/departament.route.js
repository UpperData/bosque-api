const express =require ('express');
const router= express.Router();
const dept=require('../controllers/departaments.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/DepT/GET/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']),dept.getDepartament); //Buscar departamentos
router.post('/DePT/NEW/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.createDepartament); //Crear departamentos
router.put('/DEpT/UPdate/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.editDepartament); //Modificar departamentos
router.post('/DePT/sub/NEW/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.createSubDepartament); //Crear subDepartamentos
router.put('/DEpT/sub/UPdate/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.editSubDepartament); //Modificar SubDepartamentos
router.post('/DePT/sub/Cargo/NEW/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.createCargo); //Crear cargo
router.put('/DEpT/sub/Cargo/UPdate/',forceBrute.notBruteSecure,auth.autorizedRole([5]),dept.editCargo); //Modificar Cargo
module.exports=router;