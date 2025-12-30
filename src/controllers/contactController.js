// const db = require("../db");

// // GET /contacts/:id/edit
// function showEditContactForm(req, res) {
//   const contactId = req.params.id;

//   const sql = "SELECT * FROM contacts WHERE id = ?";

//   db.get(sql, [contactId], (err, contact) => {
//     if (err) {
//       console.error("Error fetching contact:", err);
//       return res.status(500).send("Error fetching contact");
//     }

//     if (!contact) {
//       return res.status(404).send("Contact not found");
//     }

//     res.render("contacts/edit", {
//       contact
//     });
//   });
// }

// // POST /contacts/:id/edit
// function updateContact(req, res) {
//   const contactId = req.params.id;
//   const { email, phone } = req.body;

//   const updateSql = `
//     UPDATE contacts
//     SET email = ?, phone = ?
//     WHERE id = ?
//   `;

//   db.run(updateSql, [email, phone, contactId], function (err) {
//     if (err) {
//       console.error(" SQLite Update Error:", err.message);
//       return res.status(500).send("Error updating contact");
//     }

//     // Fetch client_id safely for redirect
//     const getClientSql = "SELECT client_id FROM contacts WHERE id = ?";

//     db.get(getClientSql, [contactId], (err, row) => {
//       if (err || !row) {
//         return res.redirect("/clients");
//       }
//       res.redirect("/clients/" + row.client_id);
//     });
//   });
// }

// module.exports = {
//   showEditContactForm,
//   updateContact
// };



const db = require("../db");

function showAddContactForm(req, res) {
    res.render("contacts/form", {
        clientId: req.params.id,
        contact: null
    });
}

function createContact(req, res) {
    const { name, phone, email } = req.body;
    const clientId = req.params.id;

    db.run(
        `INSERT INTO contacts (client_id, name, phone, email) VALUES (?, ?, ?, ?)`,
        [clientId, name, phone, email || ""],
        () => res.redirect(`/clients/${clientId}`)
    );
}

function showEditContactForm(req, res) {
    db.get(
        `SELECT * FROM contacts WHERE id = ?`,
        [req.params.id],
        (err, contact) => {
            res.render("contacts/form", {
                contact,
                clientId: contact.client_id
            });
        }
    );
}

function updateContact(req, res) {
    const { name, phone, email } = req.body;

    db.run(
        `UPDATE contacts SET name=?, phone=?, email=? WHERE id=?`,
        [name, phone, email || "", req.params.id],
        function () {
            res.redirect("back");
        }
    );
}

module.exports = {
    showAddContactForm,
    createContact,
    showEditContactForm,
    updateContact
};
