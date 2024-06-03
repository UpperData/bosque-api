const express =require ('express');
const router= express.Router();
const reportSystem=require('../controllers/systemReports.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');
// RRHH
router.get('/reporTs/rrhh/ActiveD/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.employeeFileActived);
router.get('/reporTs/rrhh/INActiveD/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.employeeFileNoActived);
router.get('/reporTs/rrHH/Female/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.employeeFileFemale);
router.get('/reporTs/RRhh/male/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.employeeFileMale);

//Atención medica
router.get('/reporTs/appointment/CLOSED/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.appointmenClosed); // Citas cerradas
router.get('/reporTs/appoiNtment/OpeNEd/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.appointmenOpened); // Citas abiertas
router.get('/rePOrTs/appoiNtmenT/ApS/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.appointmenAPS); // Citas Tipo APS
router.get('/rePOrTs/aPpoiNtmenT/DOMIciLIO/:startDate/:endDate',auth.autorizedRole([5]),reportSystem.appointmenDocicilio); // Citas Tipo APS

//Inventario
router.get('/rePorTs/iNVEntory/low/stock',auth.autorizedRole([5]),reportSystem.inventoryLowStock); // inventario con bajo stock
router.get('/rePorTs/iNvEntory/sold/out',auth.autorizedRole([5]),reportSystem.inventorySoldOut); // inventario agotado
router.get('/rePorTs/iNvEntory/out/wharehouse',auth.autorizedRole([5]),reportSystem.inventoryOutWharehouse); // inventario sin almacén
router.get('/rePorTs/iNvEntory/in/aSIGnmenT',auth.autorizedRole([5]),reportSystem.inventoryInAsignment); // inventario en transito


module.exports=router;