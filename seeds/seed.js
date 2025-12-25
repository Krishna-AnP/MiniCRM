const db = require("../src/db");
const bcrypt = require("bcrypt");

async function runSeed() {
    const hashedPassword = await bcrypt.hash("123456", 10);

    db.serialize(() => {
        console.log("Connected to SQLite database");

        // ================= USERS (⭐ role added)
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

        // ================= USERS DATA (⭐ MULTI ROLE)
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
            INSERT OR IGNORE INTO contacts (client_id, name, phone)
            VALUES
                (1, "Rohan - Manager", "9000011111"),
                (2, "Priya - HR", "9000022222"),
                (3, "Aman - Support", "9000033333")
        `);

        // ================= TASKS
        db.run(`
            INSERT OR IGNORE INTO tasks (client_id, title, due_date, status)
            VALUES
                (1, "Follow up with Rohan", "2025-01-10", "pending"),
                (2, "Send proposal to Priya", "2025-01-12", "completed"),
                (3, "Schedule meeting with Aman", "2025-01-15", "pending")
        `);

        // ================= INVOICES
        db.run(`
            INSERT OR IGNORE INTO invoices (client_id, amount, status)
            VALUES
                (1, 15000, "paid"),
                (2, 22000, "unpaid"),
                (3, 18000, "pending")
        `);

        console.log("✅ Seeding completed");
    });

    setTimeout(() => db.close(), 500);
}

runSeed();
