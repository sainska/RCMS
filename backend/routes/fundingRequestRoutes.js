const express = require('express');
const router = express.Router();
const fundingRequestController = require('../controllers/fundingRequestController');

router.post('/', fundingRequestController.createFundingRequest);
router.get('/', fundingRequestController.getFundingRequests);
router.put('/:id', fundingRequestController.updateFundingRequest);
router.delete('/:id', fundingRequestController.deleteFundingRequest);

module.exports = router;
