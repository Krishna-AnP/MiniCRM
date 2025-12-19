// const db = require("../db");

// // ================= LIST TASKS =================
// exports.listTasks = (req, res) => {
//     const query = `
//         SELECT tasks.*, clients.name AS client_name
//         FROM tasks
//         LEFT JOIN clients ON tasks.client_id = clients.id
//         ORDER BY tasks.id DESC
//     `;

//     db.all(query, [], (err, tasks) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Error fetching tasks");
//         }

//         res.render("tasks/list", { tasks });
//     });
// };

// // ================= SHOW NEW TASK FORM =================
// exports.showNewTaskForm = (req, res) => {
//     const clientId = req.params.id;

//     db.get(
//         "SELECT * FROM clients WHERE id = ?",
//         [clientId],
//         (err, client) => {
//             if (err || !client) {
//                 return res.status(404).send("Client not found");
//             }

//             res.render("tasks/new", { client });
//         }
//     );
// };

// // ================= CREATE TASK =================
// exports.createTask = (req, res) => {
//     const clientId = req.params.id;
//     const { title, description, status, due_date } = req.body;

//     if (!title) {
//         return res.send("Title required");
//     }

//     const query = `
//         INSERT INTO tasks (client_id, title, description, status, due_date)
//         VALUES (?, ?, ?, ?, ?)
//     `;

//     db.run(
//         query,
//         [
//             clientId,
//             title,
//             description || "",
//             status || "pending",
//             due_date || null
//         ],
//         (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send("Task not created");
//             }

//             // client detail page pe redirect
//             res.redirect(`/clients/${clientId}`);
//         }
//     );
// };



const db = require("../db");

// ================= LIST TASKS =================
exports.listTasks = (req, res) => {
    const query = `
        SELECT tasks.*, clients.name AS client_name
        FROM tasks
        LEFT JOIN clients ON tasks.client_id = clients.id
        ORDER BY tasks.id DESC
    `;

    db.all(query, [], (err, tasks) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching tasks");
        }

        res.render("tasks/list", { tasks });
    });
};

// ================= SHOW NEW TASK FORM =================
exports.showNewTaskForm = (req, res) => {
    const clientId = req.params.id;

    db.get(
        "SELECT * FROM clients WHERE id = ?",
        [clientId],
        (err, client) => {
            if (err || !client) {
                return res.status(404).send("Client not found");
            }

            // ✅ Render the correct form view
            res.render("tasks/form", { client });
        }
    );
};

// ================= CREATE TASK =================
exports.createTask = (req, res) => {
    const clientId = req.params.id;
    const { title, description, status, due_date } = req.body;

    if (!title) {
        return res.send("Title required");
    }

    const query = `
        INSERT INTO tasks (client_id, title, description, status, due_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            clientId,
            title,
            description || "",
            status || "pending",
            due_date || null
        ],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Task not created");
            }

            // Redirect to client detail page
            res.redirect(`/clients/${clientId}`);
        }
    );
};
