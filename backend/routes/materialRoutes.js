// routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const MaterialRequest = require('../models/MaterialRequest');

// ✅ Create a new material request
router.post('/request', async (req, res) => {
  try {
    const { companyId, projectId, materials } = req.body;

    // Debug: log incoming request
    console.log('📦 Incoming Material Request:', req.body);

    // Validate required fields
    if (!companyId || !projectId || !Array.isArray(materials) || materials.length === 0) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'companyId, projectId, and materials array are required'
      });
    }

    // Create and save new request
    const newRequest = new MaterialRequest({
      companyId,
      projectId,
      materials,
      status: 'Pending',
      requestedAt: new Date()
    });

    await newRequest.save();

    res.status(201).json({
      message: '✅ Material request submitted successfully',
      request: newRequest
    });

  } catch (error) {
    console.error('❌ Error creating material request:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Server error while creating request' });
  }
});

// ✅ Get all material requests (Project Manager view)
router.get('/', async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate('companyId projectId')
      .sort({ requestedAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('❌ Error fetching material requests:', error.message);
    res.status(500).json({ error: 'Server error fetching requests' });
  }
});

// ✅ Approve or reject a request
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Material request not found' });
    }

    res.status(200).json({
      message: `✅ Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });

  } catch (error) {
    console.error('❌ Error updating request status:', error.message);
    res.status(500).json({ error: 'Server error while updating request status' });
  }
});

module.exports = router;
