const express =require ('express');
const router= express.Router();
const appoint=require('../controllers/appointment.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');
router.post('/APpOINtMeNt/NEW/',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.appointmentNew); // Regsitra cita
router.put('/APPOIntMent/edit/',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.updateAppointment); // Modifica cita
router.get('/APPOINtMent/get/:id',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.getAppointment); // consulta cita
router.get('/aPPoINtMent/DOCToR/By',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.getAppointmentByDoctor); // obtiene citas de un doctor
router.get('/aPpoINtMent/by/DATE/:dateAppointment',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.getAppointmentByDate); // obtiene citas de un dia
router.get('/aPpoInTMent/by/pAY/:employeeFileId',forceBrute.notBruteSecure,auth.autorizedRole(['5']), appoint.getAppointmentByPay); // obtiene citas sin pagar
module.exports=router;