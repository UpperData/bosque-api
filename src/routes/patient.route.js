const express =require ('express');
const router= express.Router();
const patient=require('../controllers/patient.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');
router.get('/PaTIENT/medicaL/HistoRy/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]), patient.history); // obtiee historia medica
module.exports=router;