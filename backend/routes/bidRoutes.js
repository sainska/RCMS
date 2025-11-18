const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');

// Submit new bid
router.post('/submit', async (req, res) => {
  try {
    const bid = new Bid(req.body);
    await bid.save();
    res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting bid', error });
  }
});

// Get bids by company
router.get('/company/:companyId', async (req, res) => {
  try {
    const bids = await Bid.find({ companyId: req.params.companyId }).populate('projectId');
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bids', error });
  }
});

module.exports = router;
