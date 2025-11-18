const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/mpesa/stkpush', paymentController.startMpesaPayment);
router.post('/mpesa/callback', paymentController.mpesaCallback);
router.get('/status', paymentController.getPaymentStatus);

module.exports = router;


