const express =require ('express');
const router= express.Router();
const employeeFile=require('../controllers/employeefile.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/Admin/EMPLoyeeFILE/Get/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.getEmployeeFile); // Buscar una ficha de empleado
router.post('/ADMin/eMPLoyEEFILE/ADd/',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.addEmployeeFile); // agrega una ficha de empleado
router.put('/ADmin/emPLoyeeFiLE/EDiT/',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.editEmployeeFile); // modifica una ficha de empleado
router.get('/EMplOyeFIle/BYGRoUP/get/',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.getEmployeeFileByGroups); // retorna empleados por grupo 
router.get('/EMplOyeFIle/StATUS/gET/:status',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.getEmployeeFileByStatus); // retorna empleados por estatus
router.put('/EMplOyefIle/update/fee/',forceBrute.notBruteSecure,auth.autorizedRole([5]), employeeFile.feeEmployeeUpdate); // actualizar honorario


module.exports=router;