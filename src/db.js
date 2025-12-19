const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

// 🔥 ENSURE description column exists
db.run(
    "ALTER TABLE tasks ADD COLUMN description TEXT",
    () => {
        console.log("description column ensured");
    }
);

module.exports = db;

