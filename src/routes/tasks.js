const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const allowRoles = require("../middleware/roleMiddleware");

const { listTasks, showNewTaskForm, createTask } = taskController;

// ================= TASK LIST =================
// GET /tasks
router.get("/tasks", listTasks);

// ================= NEW TASK FORM =================
// GET /clients/:id/tasks/new
router.get("/clients/:id/tasks/new", allowRoles("superadmin", "admin"), showNewTaskForm);

// ================= SAVE TASK =================
// POST /clients/:id/tasks/new
router.post("/clients/:id/tasks/new",  allowRoles("superadmin", "admin"), createTask);

module.exports = router;
