const express = require('express');
const router = express.Router();
const sales = require('../controllers/sales.ctrl');
const forceBrute = require('../controllers/middleware/noBrute.ctrl');
router.get('/sales/all/:accountId', forceBrute.notBruteSecure, sales.pendinOrders); //
router.get('/sales/userWithOrder', forceBrute.notBruteSecure, sales.userWithOrders); //

module.exports = router;