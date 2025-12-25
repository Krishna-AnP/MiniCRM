const express = require("express");
const router = express.Router();

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
router.get("/new", showNewClientForm);
router.post("/new", createClient);
router.get("/", listClients);

// ===== TASK ROUTES (ABOVE :id) =====
router.get("/:id/tasks/new", showNewTaskForm);
router.post("/:id/tasks", createTask);

// ===== CLIENT DETAIL (LAST) =====
router.get("/:id", getClientDetail);

module.exports = router;