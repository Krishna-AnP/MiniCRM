const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// List all invoices
router.get("/invoices", invoiceController.listInvoices);

// Show form to create new invoice for a client
router.get("/clients/:id/invoices/new", invoiceController.showNewInvoiceForm);

// Save new invoice
router.post("/clients/:id/invoices/new", invoiceController.createInvoice);

module.exports = router;
