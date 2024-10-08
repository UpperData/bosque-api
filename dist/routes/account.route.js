const express = require('express');
const router = express.Router();
const account = require('../controllers/account.ctrl');
const auth = require('../controllers/middleware/auth.ctrl');
const forceBrute = require('../controllers/middleware/noBrute.ctrl');

router.post('/accOunT/RegisTER', forceBrute.notBruteSecure, auth.autorizedRole([5]), account.registerAccount); // Registro de cuentas de usuario
router.post('/accOunT/regisTER/buyer', forceBrute.notBruteSecure, account.buyerRegisterAccount); // Registro de cuentas de usuario de comprador
router.post('/PASSwORD/RestarRT', forceBrute.notBruteSecure, account.passwordRestart); // Restaura la contraseña
router.put('/PASSwORD/UPDATE', forceBrute.notBruteSecure, auth.autorizedRole(['*']), account.passwordUpdate); // Actualizar la contraseña
router.get('/accoUnt/EmAIl/VALIDAtor/:email', forceBrute.notBruteSecure, account.validateEmail); //Valida dirección de correo electronico
router.get('/accoUnt/phone/VALIDAtor/:phone', forceBrute.notBruteSecure, account.validatePhone); //Valida número de teléfono
router.get('/aCCoUnt/EMAIl/Get/QUEStIOns/:email', forceBrute.notBruteSecure, account.getSecret); //Optienes respuestas secretas
router.get('/ACCounT/restoRe/SeCReCT/:email', forceBrute.notBruteSecure, account.restoreSecret);
router.get('/cema/validate/SeCRE/toKEN/:token', forceBrute.notBruteSecure, account.resetSecretAnswer); //Evalua token de solicitud de actualización de secret answer
router.put('/cema/security/cont/', forceBrute.notBruteSecure, auth.autorizedRole(['*']), account.updateSecret); //Actualiza Respuesta secreta 
router.get('/login/:token', forceBrute.notBruteSecure, account.loginToken); // autenticación por token
router.get('/accoUNT/pROfiLE', forceBrute.notBruteSecure, auth.autorizedRole(['*']), account.getProfile); // obtiene perfil de un usuario
router.get('/account/grouPs', forceBrute.notBruteSecure, auth.autorizedRole(['*']), account.getRoleByAccount); //obtiene los grupos de un usuario
router.put('/acCOUNT/EmaIl/UPDATE', forceBrute.notBruteSecure, auth.autorizedRole(['*']), account.emailUpdate); //Solicita actualizar email del usuario actual
router.get('/email/verify/:token', forceBrute.notBruteSecure, account.emailVerify); //Certifica email
router.get('/EMAIl/STaTus/veriFy', forceBrute.notBruteSecure, account.isCertificated); // Verifica si un email esta certificado
router.get('/EmAIL/TOKEn/verifysEnd', forceBrute.notBruteSecure, account.emailCertificationToken); //Genera y envia  token para certificacion de email
router.get('/secREt/CURRENT/GET', forceBrute.notBruteSecure, account.getSecretCurrent); // Retorna preguntas secretas del usuario actual
router.get('/account/actives/get', forceBrute.notBruteSecure, account.getActiveAccount); // Optener cuenta de usuario activas


module.exports = router;