// const express = require("express");
// const router = express.Router();
// const allowRoles = require("../middleware/roleMiddleware");
// const contactController = require("../controllers/contactController");

// // Show edit contact form
// router.get(
//   "/contacts/:id/edit",
//   allowRoles("superadmin", "admin"),
//   contactController.showEditContactForm
// );

// // Update contact
// router.post(
//   "/contacts/:id/edit",
//   allowRoles("superadmin", "admin"),
//   contactController.updateContact
// );

// module.exports = router;



const express = require("express");
const router = express.Router();
const allowRoles = require("../middleware/roleMiddleware");
const {
    showAddContactForm,
    createContact,
    showEditContactForm,
    updateContact
} = require("../controllers/contactController");

router.get(
    "/clients/:id/contacts/new",
    allowRoles("admin", "superadmin"),
    showAddContactForm
);

router.post(
    "/clients/:id/contacts/new",
    allowRoles("admin", "superadmin"),
    createContact
);

router.get(
    "/contacts/:id/edit",
    allowRoles("admin", "superadmin"),
    showEditContactForm
);

router.post(
    "/contacts/:id/edit",
    allowRoles("admin", "superadmin"),
    updateContact
);

module.exports = router;
