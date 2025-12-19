const db = require("../db");

/**
 * GET /clients
 * Optional filter: /clients?status=Active
 */
function listClients(req, res) {
    const status = req.query.status;

    let sql = "SELECT * FROM clients";
    let params = [];

    if (status) {
        sql += " WHERE LOWER(status) = ?";
        params.push(status.toLowerCase());
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Error fetching clients:", err);
            return res.status(500).send("Error fetching clients");
        }

        res.render("clients/list", {
            clients: rows,
            selectedStatus: status
        });
    });
}

/**
 * GET /clients/new
 * Show add new client form
 */
function showNewClientForm(req, res) {
    // 👉 form.ejs render hoga
    res.render("clients/form");
}

/**
 * POST /clients/new
 * Create a new client
 */
function createClient(req, res) {
    const { name, email, phone, status } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).send("Name and email are required.");
    }

    const sql = `
        INSERT INTO clients (name, email, phone, status)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [name, email, phone || "", status || "active"],
        function (err) {
            if (err) {
                console.error("Error creating client:", err.message);
                return res.status(500).send("Error creating client.");
            }

            // New client detail page
            res.redirect(`/clients/${this.lastID}`);
        }
    );
}

/**
 * GET /clients/:id
 * Client detail with contacts, tasks, invoices
 */
function getClientDetail(req, res) {
    const clientId = req.params.id;

    const clientQuery = "SELECT * FROM clients WHERE id = ?";
    const contactsQuery = "SELECT * FROM contacts WHERE client_id = ?";
    const tasksQuery = "SELECT * FROM tasks WHERE client_id = ?";
    const invoicesQuery = "SELECT * FROM invoices WHERE client_id = ?";

    db.get(clientQuery, [clientId], (err, client) => {
        if (err) {
            console.error("Error fetching client:", err);
            return res.status(500).send("Error fetching client");
        }

        if (!client) {
            return res.status(404).send("Client not found");
        }

        db.all(contactsQuery, [clientId], (err, contacts) => {
            if (err) {
                console.error("Error fetching contacts:", err);
                return res.status(500).send("Error fetching contacts");
            }

            db.all(tasksQuery, [clientId], (err, tasks) => {
                if (err) {
                    console.error("Error fetching tasks:", err);
                    return res.status(500).send("Error fetching tasks");
                }

                db.all(invoicesQuery, [clientId], (err, invoices) => {
                    if (err) {
                        console.error("Error fetching invoices:", err);
                        return res.status(500).send("Error fetching invoices");
                    }

                    res.render("clients/detail", {
                        client,
                        contacts,
                        tasks,
                        invoices
                    });
                });
            });
        });
    });
}

module.exports = {
    listClients,
    showNewClientForm,
    createClient,
    getClientDetail
};
