const db = require("../db");

async function getDashboardStats(req, res) {
    try {
        // 🔐 Dashboard protected
        if (!req.session.user) {
            return res.redirect("/login");
        }

        // ================= COUNTS =================

        const activeClients = await new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM clients WHERE status = 'Active'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });

        const openTasks = await new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM tasks WHERE status = 'pending'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });

        const paidInvoices = await new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM invoices WHERE status = 'paid'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });

        const unpaidInvoices = await new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM invoices WHERE status = 'unpaid'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });

        const overdueInvoices = await new Promise((resolve, reject) => {
            db.get(
                "SELECT COUNT(*) AS total FROM invoices WHERE status = 'overdue'",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                }
            );
        });

        // ================= LATEST CLIENTS =================
        const latestClients = await new Promise((resolve, reject) => {
            db.all(
                "SELECT name, email, status FROM clients ORDER BY id DESC LIMIT 5",
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // ================= UPCOMING TASKS =================
        const upcomingTasks = await new Promise((resolve, reject) => {
            db.all(
                "SELECT title, due_date, status FROM tasks ORDER BY due_date ASC LIMIT 5",
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // ================= RENDER =================
        res.render("dashboard", {
            user: req.session.user,

            activeClients,
            openTasks,
            paidInvoices,
            unpaidInvoices,
            overdueInvoices,

            latestClients,
            upcomingTasks
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).send("Error loading dashboard");
    }
}

module.exports = { getDashboardStats };