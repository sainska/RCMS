const Transaction = require('../models/Transaction');
const { initiateStkPush } = require('../utils/mpesa');

exports.startMpesaPayment = async (req, res) => {
  try {
    const { project, amount, phoneNumber, accountReference, description } = req.body;
    if (!amount || !phoneNumber) {
      return res.status(400).json({ message: 'amount and phoneNumber are required' });
    }

    const stk = await initiateStkPush({
      amount: Number(amount),
      phoneNumber: String(phoneNumber),
      accountReference: accountReference || project || 'RCMS',
      transactionDesc: description || 'RCMS Payment',
    });

    const tx = await Transaction.create({
      project: project || 'N/A',
      amount: Number(amount),
      status: 'Pending',
      date: new Date(),
      provider: 'mpesa',
      phoneNumber: String(phoneNumber),
      merchantRequestId: stk.MerchantRequestID,
      checkoutRequestId: stk.CheckoutRequestID,
    });

    return res.status(200).json({
      message: 'STK push initiated',
      transaction: tx,
      stk,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to initiate M-Pesa STK', error: err.message });
  }
};

// M-Pesa callback handler
exports.mpesaCallback = async (req, res) => {
  try {
    const body = req.body || {};
    const callback = body.Body?.stkCallback || {};
    const checkoutRequestID = callback.CheckoutRequestID;
    const resultCode = String(callback.ResultCode ?? '');
    const resultDesc = String(callback.ResultDesc ?? '');

    // Update stored transaction
    const meta = {};
    if (Array.isArray(callback.CallbackMetadata?.Item)) {
      for (const item of callback.CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') meta.receiptNumber = item.Value;
      }
    }

    const status = resultCode === '0' ? 'Success' : 'Failed';
    await Transaction.findOneAndUpdate(
      { checkoutRequestId: checkoutRequestID },
      { status, resultCode, resultDesc, ...meta },
      { new: true }
    );

    // Respond to M-Pesa right away
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.query;
    if (!checkoutRequestId) return res.status(400).json({ message: 'checkoutRequestId is required' });
    const tx = await Transaction.findOne({ checkoutRequestId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    return res.status(200).json(tx);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch status', error: err.message });
  }
};


