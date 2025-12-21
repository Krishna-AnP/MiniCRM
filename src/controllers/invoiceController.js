const db = require("../db");

// ================= LIST ALL INVOICES =================
exports.listInvoices = (req, res) => {
    const sql = `
        SELECT 
            invoices.id,
            clients.name AS client_name,
            invoices.amount,
            invoices.status
        FROM invoices
        LEFT JOIN clients ON invoices.client_id = clients.id
        ORDER BY invoices.id ASC
    `;
    db.all(sql, [], (err, invoices) => {
        if (err) {
            console.error("Error fetching invoices:", err);
            return res.status(500).send("Error fetching invoices");
        }
        res.render("invoices/list", { invoices });
    });
};

// ================= SHOW NEW INVOICE FORM =================
exports.showNewInvoiceForm = (req, res) => {
    const clientId = req.params.id;
    db.get("SELECT * FROM clients WHERE id = ?", [clientId], (err, client) => {
        if (err || !client) {
            console.error(err);
            return res.status(404).send("Client not found");
        }
        res.render("invoices/form", { client, invoice: null });
    });
};

// ================= CREATE INVOICE =================
exports.createInvoice = (req, res) => {
    const clientId = req.params.id;
    const { amount, status } = req.body;

    if (!amount) return res.send("Amount is required");

    const sql = `INSERT INTO invoices (client_id, amount, status) VALUES (?, ?, ?)`;
    db.run(sql, [clientId, amount, status || "unpaid"], (err) => {
        if (err) {
            console.error("Error inserting invoice:", err);
            return res.status(500).send("Failed to create invoice");
        }
        res.redirect(`/clients/${clientId}`);
    });
};
