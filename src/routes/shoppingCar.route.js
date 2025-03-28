const express =require ('express');
const router= express.Router();
const car=require('../controllers/shoppingCar.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');


router.post('/CAR/AdD',forceBrute.notBruteSecure,car.AddShoppingCar) // registra car
router.get('/CAR/GET/:accountId',forceBrute.notBruteSecure,car.getShoppingCar) // Retorna car
router.put('/CAR/Cancel',forceBrute.notBruteSecure,car.cancelShoppincar) // cancela item del carrito
router.put('/CAR/ediT/',forceBrute.notBruteSecure,auth.autorizedRole([5]),car.editShoppincar) // edita item del carrito
router.put('/CAR/ediT/ONE',forceBrute.notBruteSecure,auth.autorizedRole([5]),car.editShoppincarOneField) // edita item del carrito
router.put('/CAR/pay',forceBrute.notBruteSecure,auth.autorizedRole([5]),car.payCar) // edita item del carrito

module.exports=router;
