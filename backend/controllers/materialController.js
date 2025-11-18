const MaterialRequest = require('../models/MaterialRequest');

exports.requestMaterials = async (req, res) => {
  try {
    const material = new MaterialRequest(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    console.error('❌ Material request error:', err);
    res.status(500).json({ message: 'Failed to submit material request' });
  }
};
