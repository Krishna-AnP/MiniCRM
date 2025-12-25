const express = require("express");
const router = express.Router();
const allowRoles = require("../middleware/roleMiddleware");

const {
    listClients,
    showNewClientForm,
    getClientDetail,
    createClient
} = require("../controllers/clientController");

const {
    showNewTaskForm,
    createTask
} = require("../controllers/taskController");

// ===== CLIENT ROUTES =====
router.get("/new",
    allowRoles("superadmin", "admin"), 
    showNewClientForm);

router.post("/new",
    allowRoles("superadmin", "admin"),
    createClient);

router.get("/", 
    allowRoles("superadmin", "admin", "user"), 
    listClients);

// ===== TASK ROUTES (ABOVE :id) =====
router.get("/:id/tasks/new",
    allowRoles("superadmin", "admin"), 
    showNewTaskForm);

router.post("/:id/tasks",
    allowRoles("superadmin", "admin"), 
    createTask);

// ===== CLIENT DETAIL (LAST) =====
router.get("/:id",
    allowRoles("superadmin", "admin"),
    getClientDetail);

module.exports = router;