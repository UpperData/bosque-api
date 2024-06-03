const express =require ('express');
const router= express.Router();
const store=require('../controllers/store.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.post('/admIn/sTORE/Create',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.createStore); // crea tienda
router.put('/admin/store/EDit',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.updateStore); //Actializa tienda
router.put('/admin/store/EDit',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.updateStore); //Actializa tienda
router.get('/adMin/SToRE/get/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.findStore); //Busca tienda por id
//Contratos
router.get('/admin/SToRE/CONTRACT/:id',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.findContract); //Busca contrato
router.get('/admin/SToRE/CONTRACT/find/:storeId',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.findContractByStore); //Busca contrato
router.post('/admIn/sTORE/contract/Create',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.createContract); // crea contract
router.put('/admIn/sTORE/CoNTract/revoke',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.revokeContract); // update contract
router.put('/admIn/sTORE/CoNTract/upload',forceBrute.notBruteSecure,auth.autorizedRole([5]), store.contractFile); // uplad file contract

module.exports=router;