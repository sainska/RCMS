const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Project = require('../models/Project');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const MaterialRequest = require('../models/MaterialRequest');

// Helper function to generate PDF
const generatePDF = async (data, reportType, res) => {
  const doc = new PDFDocument();
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=RCMS_${reportType}_Report.pdf`);
  
  // Pipe PDF to response
  doc.pipe(res);
  
  // Add RCMS Header
  doc.fontSize(20).fillColor('#006400').text('RCMS - Construction Management System', { align: 'center' });
  doc.fontSize(16).fillColor('#333').text(`${reportType} Report`, { align: 'center' });
  doc.fontSize(12).fillColor('#666').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown();
  
  // Add report content based on type
  switch(reportType) {
    case 'Project_Status':
      generateProjectStatusReport(doc, data);
      break;
    case 'Financial_Summary':
      generateFinancialReport(doc, data);
      break;
    case 'Material_Requests':
      generateMaterialReport(doc, data);
      break;
    case 'User_Activity':
      generateUserActivityReport(doc, data);
      break;
    case 'Transaction_History':
      generateTransactionReport(doc, data);
      break;
    default:
      doc.text('Report data will be displayed here');
  }
  
  // Finalize PDF
  doc.end();
};

// Project Status Report
const generateProjectStatusReport = (doc, projects) => {
  doc.fontSize(14).fillColor('#333').text('Project Status Overview', { underline: true });
  doc.moveDown();
  
  projects.forEach((project, index) => {
    doc.fontSize(12).fillColor('#000').text(`${index + 1}. ${project.projectName || project.name}`);
    doc.fontSize(10).fillColor('#666').text(`   Status: ${project.status || 'N/A'}`);
    doc.text(`   Location: ${project.location || 'N/A'}`);
    doc.text(`   Start Date: ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}`);
    doc.text(`   Budget: Ksh ${(project.budget?.allocated || 0).toLocaleString()}`);
    doc.text(`   Progress: ${project.progress || 0}%`);
    doc.moveDown(0.5);
  });
};

// Financial Summary Report
const generateFinancialReport = (doc, data) => {
  const { transactions, invoices } = data;
  
  doc.fontSize(14).fillColor('#333').text('Financial Summary', { underline: true });
  doc.moveDown();
  
  // Transactions Summary (includes payments)
  doc.fontSize(12).fillColor('#000').text('Transactions Overview:');
  let totalTransactions = 0;
  transactions.forEach((transaction, index) => {
    totalTransactions += transaction.amount || 0;
    doc.fontSize(10).fillColor('#666').text(`   ${index + 1}. ${transaction.transactionId} - Ksh ${(transaction.amount || 0).toLocaleString()} (${transaction.status || 'N/A'})`);
  });
  doc.fontSize(11).fillColor('#006400').text(`   Total Transactions: Ksh ${totalTransactions.toLocaleString()}`);
  doc.moveDown();
  
  // Invoices Summary
  doc.fontSize(12).fillColor('#000').text('Invoices Overview:');
  let totalInvoices = 0;
  invoices.forEach((invoice, index) => {
    totalInvoices += invoice.amount || 0;
    doc.fontSize(10).fillColor('#666').text(`   ${index + 1}. ${invoice.invoiceId || invoice._id} - Ksh ${(invoice.amount || 0).toLocaleString()} (${invoice.status || 'N/A'})`);
  });
  doc.fontSize(11).fillColor('#006400').text(`   Total Invoices: Ksh ${totalInvoices.toLocaleString()}`);
  doc.moveDown();
};

// Material Requests Report
const generateMaterialReport = (doc, requests) => {
  doc.fontSize(14).fillColor('#333').text('Material Requests Summary', { underline: true });
  doc.moveDown();
  
  requests.forEach((request, index) => {
    doc.fontSize(12).fillColor('#000').text(`${index + 1}. Request for ${request.projectId || 'N/A'}`);
    doc.fontSize(10).fillColor('#666').text(`   Status: ${request.status || 'N/A'}`);
    doc.text(`   Requested By: ${request.requesterName || 'N/A'}`);
    doc.text(`   Date: ${request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}`);
    if (request.materials && request.materials.length > 0) {
      doc.text('   Materials:');
      request.materials.forEach(material => {
        doc.text(`     - ${material.name} (${material.quantity} ${material.unit || 'units'})`);
      });
    }
    doc.moveDown(0.5);
  });
};

// User Activity Report
const generateUserActivityReport = (doc, users) => {
  doc.fontSize(14).fillColor('#333').text('User Activity Overview', { underline: true });
  doc.moveDown();
  
  users.forEach((user, index) => {
    doc.fontSize(12).fillColor('#000').text(`${index + 1}. ${user.fullName || user.name}`);
    doc.fontSize(10).fillColor('#666').text(`   Email: ${user.email}`);
    doc.text(`   Role: ${user.role}`);
    doc.text(`   Phone: ${user.phone || 'N/A'}`);
    doc.text(`   Status: ${user.status || 'Active'}`);
    doc.moveDown(0.5);
  });
};

// Transaction Report
const generateTransactionReport = (doc, transactions) => {
  doc.fontSize(14).fillColor('#333').text('Transaction History', { underline: true });
  doc.moveDown();
  
  transactions.forEach((transaction, index) => {
    doc.fontSize(12).fillColor('#000').text(`${index + 1}. ${transaction.transactionId}`);
    doc.fontSize(10).fillColor('#666').text(`   Type: ${transaction.type || 'N/A'}`);
    doc.text(`   Amount: Ksh ${(transaction.amount || 0).toLocaleString()}`);
    doc.text(`   Status: ${transaction.status || 'N/A'}`);
    doc.text(`   Date: ${transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}`);
    doc.text(`   Description: ${transaction.description || 'N/A'}`);
    doc.moveDown(0.5);
  });
};

// Helper function to generate Excel
const generateExcel = async (data, reportType, res) => {
  const workbook = new ExcelJS.Workbook();
  let worksheet;
  
  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=RCMS_${reportType}_Report.xlsx`);
  
  switch(reportType) {
    case 'Project_Status':
      worksheet = workbook.addWorksheet('Project Status');
      worksheet.columns = [
        { header: 'Project Name', key: 'projectName', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Location', key: 'location', width: 25 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'Budget (Ksh)', key: 'budget', width: 15 },
        { header: 'Progress (%)', key: 'progress', width: 12 }
      ];
      data.forEach(project => {
        worksheet.addRow({
          projectName: project.projectName || project.name,
          status: project.status || 'N/A',
          location: project.location || 'N/A',
          startDate: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A',
          budget: project.budget?.allocated || 0,
          progress: project.progress || 0
        });
      });
      break;
      
    case 'Financial_Summary':
      // Transactions sheet (includes payments)
      const transactionsSheet = workbook.addWorksheet('Transactions');
      transactionsSheet.columns = [
        { header: 'Transaction ID', key: 'transactionId', width: 25 },
        { header: 'Amount (Ksh)', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Type', key: 'type', width: 15 }
      ];
      data.transactions.forEach(transaction => {
        transactionsSheet.addRow({
          transactionId: transaction.transactionId,
          amount: transaction.amount || 0,
          status: transaction.status || 'N/A',
          date: transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A',
          type: transaction.type || 'N/A'
        });
      });
      
      // Invoices sheet
      const invoicesSheet = workbook.addWorksheet('Invoices');
      invoicesSheet.columns = [
        { header: 'Invoice ID', key: 'invoiceId', width: 25 },
        { header: 'Amount (Ksh)', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Due Date', key: 'dueDate', width: 15 }
      ];
      data.invoices.forEach(invoice => {
        invoicesSheet.addRow({
          invoiceId: invoice.invoiceId || invoice._id,
          amount: invoice.amount || 0,
          status: invoice.status || 'N/A',
          date: invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A',
          dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'
        });
      });
      break;
      
    default:
      worksheet = workbook.addWorksheet('Report Data');
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Date', key: 'date', width: 15 }
      ];
  }
  
  // Style the header row
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.font = { bold: true };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF006400' }
      };
      row.eachCell((cell) => {
        cell.font = { color: { argb: 'FFFFFFFF' } };
      });
    }
  });
  
  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};

// Generate Project Status Report
router.post('/project-status', async (req, res) => {
  try {
    const { format = 'pdf', filters = {} } = req.body;
    
    // Fetch projects based on filters
    let query = {};
    if (filters.status) query.status = filters.status;
    if (filters.userId) query.userId = filters.userId;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    if (format === 'excel') {
      await generateExcel(projects, 'Project_Status', res);
    } else {
      await generatePDF(projects, 'Project_Status', res);
    }
  } catch (error) {
    console.error('Error generating project status report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Generate Financial Summary Report
router.post('/financial-summary', async (req, res) => {
  try {
    const { format = 'pdf', filters = {} } = req.body;
    
    // Fetch financial data
    const transactionQuery = {};
    
    if (filters.dateFrom || filters.dateTo) {
      const dateFilter = {};
      if (filters.dateFrom) dateFilter.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) dateFilter.$lte = new Date(filters.dateTo);
      transactionQuery.createdAt = dateFilter;
    }
    
    const transactions = await Transaction.find(transactionQuery).sort({ createdAt: -1 });
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    
    const data = { transactions, invoices };
    
    if (format === 'excel') {
      await generateExcel(data, 'Financial_Summary', res);
    } else {
      await generatePDF(data, 'Financial_Summary', res);
    }
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Generate Material Requests Report
router.post('/material-requests', async (req, res) => {
  try {
    const { format = 'pdf', filters = {} } = req.body;
    
    let query = {};
    if (filters.status) query.status = filters.status;
    if (filters.companyId) query.companyId = filters.companyId;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    
    const requests = await MaterialRequest.find(query).sort({ createdAt: -1 });
    
    if (format === 'excel') {
      await generateExcel(requests, 'Material_Requests', res);
    } else {
      await generatePDF(requests, 'Material_Requests', res);
    }
  } catch (error) {
    console.error('Error generating material requests report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Generate User Activity Report
router.post('/user-activity', async (req, res) => {
  try {
    const { format = 'pdf', filters = {} } = req.body;
    
    let query = {};
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;
    
    const users = await User.find(query).sort({ createdAt: -1 });
    
    if (format === 'excel') {
      await generateExcel(users, 'User_Activity', res);
    } else {
      await generatePDF(users, 'User_Activity', res);
    }
  } catch (error) {
    console.error('Error generating user activity report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Generate Transaction History Report
router.post('/transaction-history', async (req, res) => {
  try {
    const { format = 'pdf', filters = {} } = req.body;
    
    let query = {};
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    
    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    
    if (format === 'excel') {
      await generateExcel(transactions, 'Transaction_History', res);
    } else {
      await generatePDF(transactions, 'Transaction_History', res);
    }
  } catch (error) {
    console.error('Error generating transaction history report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// Get available report types
router.get('/types', (req, res) => {
  const reportTypes = [
    {
      id: 'project-status',
      name: 'Project Status Report',
      description: 'Overview of all projects with their current status, budget, and progress',
      formats: ['pdf', 'excel'],
      filters: ['status', 'userId', 'dateRange']
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary Report',
      description: 'Comprehensive financial overview including payments, transactions, and invoices',
      formats: ['pdf', 'excel'],
      filters: ['dateRange']
    },
    {
      id: 'material-requests',
      name: 'Material Requests Report',
      description: 'All material requests with their status and details',
      formats: ['pdf', 'excel'],
      filters: ['status', 'companyId', 'dateRange']
    },
    {
      id: 'user-activity',
      name: 'User Activity Report',
      description: 'User accounts and their activity status',
      formats: ['pdf', 'excel'],
      filters: ['role', 'status']
    },
    {
      id: 'transaction-history',
      name: 'Transaction History Report',
      description: 'Detailed transaction history with status and amounts',
      formats: ['pdf', 'excel'],
      filters: ['status', 'type', 'dateRange']
    }
  ];
  
  res.json(reportTypes);
});

module.exports = router;
