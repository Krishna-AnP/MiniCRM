const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const allowRoles = require("../middleware/roleMiddleware");

// List all invoices
router.get("/invoices",
    allowRoles("superadmin", "admin", "user"), 
    invoiceController.listInvoices);

// Show form to create new invoice for a client
router.get("/clients/:id/invoices/new", 
    allowRoles("superadmin", "admin"),
    invoiceController.showNewInvoiceForm);

// Save new invoice
router.post("/clients/:id/invoices/new",
    allowRoles("superadmin", "admin"),
    invoiceController.createInvoice);

module.exports = router;
