let seedHasRun = false;

if (seedHasRun) {
  console.log("Seed already executed, skipping...");
  process.exit(0);
}
seedHasRun = true;

const db = require("../src/db");
const bcrypt = require("bcrypt");

async function runSeed() {
    const hashedPassword = await bcrypt.hash("123456", 10);

    db.serialize(() => {
        console.log("Connected to SQLite database");

        // ================= USERS (role added)
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `);

        // ================= CLIENTS
        db.run(`
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                status TEXT
            )
        `);

        // ================= CONTACTS
        db.run(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                name TEXT,
                phone TEXT
            )
        `);
        // ================= ADD EMAIL COLUMN TO CONTACTS (SAFE)
        db.run(
        `ALTER TABLE contacts ADD COLUMN email TEXT`,
        (err) => {
            if (err) {
            // Ignore error if column already exists
            if (!err.message.includes("duplicate column")) {
                console.error("Error adding email column to contacts:", err.message);
            }
            } else {
            console.log(" Email column added to contacts table");
            }
        }
        );

        // ================= TASKS
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                title TEXT,
                due_date TEXT,
                status TEXT
            )
        `);

        // ================= INVOICES
        db.run(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                amount REAL,
                status TEXT
            )
        `);

        // ================= USERS DATA (MULTI ROLE)
        db.run(
            `INSERT OR IGNORE INTO users (email, password_hash, role)
             VALUES (?, ?, ?)`,
            ["superadmin@gmail.com", hashedPassword, "superadmin"]
        );

        db.run(
            `INSERT OR IGNORE INTO users (email, password_hash, role)
             VALUES (?, ?, ?)`,
            ["admin@gmail.com", hashedPassword, "admin"]
        );

        db.run(
            `INSERT OR IGNORE INTO users (email, password_hash, role)
             VALUES (?, ?, ?)`,
            ["user@gmail.com", hashedPassword, "user"]
        );

        // ================= CLIENTS
        db.run(`
            INSERT OR IGNORE INTO clients (id, name, email, phone, status)
            VALUES
                (1, "Rohan Sharma", "rohan@example.com", "9876543210", "Active"),
                (2, "Priya Patel", "priya@example.com", "9988776655", "Active"),
                (3, "Aman Verma", "aman@example.com", "9090909090", "Inactive")
        `);

        // ================= CONTACTS
    db.run(`
        INSERT INTO contacts (client_id, name, phone)
        SELECT 1, 'Rohan - Manager', '9000011111'
        WHERE NOT EXISTS (
            SELECT 1 FROM contacts
            WHERE client_id = 1 AND name = 'Rohan - Manager'
        )
    `);

    db.run(`
        INSERT INTO contacts (client_id, name, phone)
        SELECT 2, 'Priya - HR', '9000022222'
        WHERE NOT EXISTS (
            SELECT 1 FROM contacts
            WHERE client_id = 2 AND name = 'Priya - HR'
        )
    `);

    db.run(`
        INSERT INTO contacts (client_id, name, phone)
        SELECT 3, 'Aman - Support', '9000033333'
        WHERE NOT EXISTS (
            SELECT 1 FROM contacts
            WHERE client_id = 3 AND name = 'Aman - Support'
        )
    `);


        // ================= TASKS
    db.run(`
        INSERT INTO tasks (client_id, title, due_date, status)
        SELECT 1, 'Follow up with Rohan', '2025-01-10', 'pending'
        WHERE NOT EXISTS (
            SELECT 1 FROM tasks
            WHERE client_id = 1 AND title = 'Follow up with Rohan'
        )
    `);

    db.run(`
        INSERT INTO tasks (client_id, title, due_date, status)
        SELECT 2, 'Send proposal to Priya', '2025-01-12', 'completed'
        WHERE NOT EXISTS (
            SELECT 1 FROM tasks
            WHERE client_id = 2 AND title = 'Send proposal to Priya'
        )
    `);

    db.run(`
        INSERT INTO tasks (client_id, title, due_date, status)
        SELECT 3, 'Schedule meeting with Aman', '2025-01-15', 'pending'
        WHERE NOT EXISTS (
            SELECT 1 FROM tasks
            WHERE client_id = 3 AND title = 'Schedule meeting with Aman'
        )
    `);


        // ================= INVOICES
    db.run(`
        INSERT INTO invoices (client_id, amount, status)
        SELECT 1, 15000, 'paid'
        WHERE NOT EXISTS (
            SELECT 1 FROM invoices
            WHERE client_id = 1 AND amount = 15000
        )
    `);

    db.run(`
        INSERT INTO invoices (client_id, amount, status)
        SELECT 2, 22000, 'unpaid'
        WHERE NOT EXISTS (
            SELECT 1 FROM invoices
            WHERE client_id = 2 AND amount = 22000
        )
    `);

    db.run(`
        INSERT INTO invoices (client_id, amount, status)
        SELECT 3, 18000, 'pending'
        WHERE NOT EXISTS (
            SELECT 1 FROM invoices
            WHERE client_id = 3 AND amount = 18000
        )
    `);


        console.log("✅ Seeding completed");
    });

    setTimeout(() => db.close(), 500);
}

runSeed();
