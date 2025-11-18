const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create invoice', error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update invoice', error: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice', error: err.message });
  }
};
