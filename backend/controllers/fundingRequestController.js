const FundingRequest = require('../models/FundingRequest');

exports.createFundingRequest = async (req, res) => {
  try {
    const request = new FundingRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create funding request', error: err.message });
  }
};

exports.getFundingRequests = async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch funding requests', error: err.message });
  }
};

exports.updateFundingRequest = async (req, res) => {
  try {
    const request = await FundingRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update funding request', error: err.message });
  }
};

exports.deleteFundingRequest = async (req, res) => {
  try {
    await FundingRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Funding request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete funding request', error: err.message });
  }
};
