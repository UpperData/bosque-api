const express =require ('express');
const router= express.Router();
const general=require('../controllers/generals.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/CarS/YEARS',forceBrute.notBruteSecure, general.getCarYear) // Retorna años
router.get('/CaRS/MAkeS',forceBrute.notBruteSecure, general.getCarMakes) // Retorna marcas
router.get('/CaRS/MODels/:make',forceBrute.notBruteSecure, general.getCarModels) // modelo de marcas
router.get('/CaRS/MoDelS/id/:makeId',forceBrute.notBruteSecure, general.getCarModelsByMakeId) // Modelo de marca por Id
router.get('/bar/MENU/',forceBrute.notBruteSecure, general.getBarMenu) // Obtiene barra de menu
router.get('/civil/get/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getCivil); // retorna estado civil
router.get('/phone/get/type/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getPhoneType); // retorna phone types
router.get('/departament/get/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getDepartament); // retorna departemento de la empresa
router.get('/sUBDepartament/get/:depId',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getSubDepartament); // retorna SubDepartemento de la empresa
router.get('/CargO/GEt/:depId',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getCargo); // retorna Cargos de la empresa
router.get('/pAtieNt/TYPE/geT/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getPatienType); // retorna tipo de paciente
router.get('/StaTES/VZLA/gET/:id',forceBrute.notBruteSecure, general.getState); // retorna estados de Venezuela
router.get('/citIes/VZlA/STAte/:stateId',forceBrute.notBruteSecure, general.getCitiesByState); // retorna ciudades de un estado
router.get('/PROvInCES/VzlA/State/:stateId',forceBrute.notBruteSecure, general.getProvincesByState); // retorna municipios de un estado
router.get('/pARRoQuiaS/vzlA/PROVINCes/:provinceId',forceBrute.notBruteSecure, general.getParroquiaByProvince); // retorna parroquias de municipio
router.get('/APpOINtMENt/typE/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getAppointmentTpye); // Tipos de citas
router.get('/exaMs/geT/:id',forceBrute.notBruteSecure,auth.autorizedRole(['*']), general.getExams); // Examenes medicos

module.exports=router;
