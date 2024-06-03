
const express =require ('express');
const router= express.Router();
const report=require('../controllers/medicalReport.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');
router.get('/MEdiCaL/GET/Report/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]),report.medicalReportGet); //Obtiener un informe medico
router.post('/MEDiCAl/aDd/REport/',forceBrute.notBruteSecure,auth.autorizedRole([5]),report.medicalRepostNew); //registra un informe medico
router.put('/mEdiCaL/EDiT/RepORt/',forceBrute.notBruteSecure,auth.autorizedRole([5]),report.medicalReportEdit); //edita un informe medico
router.get('/mEdiCAL/get/RePORt/DOCtOR/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]),report.medicalReportGetByDoctor); //edita un informe medico
module.exports=router;