const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

const { listTasks, showNewTaskForm, createTask } = taskController;

// ================= TASK LIST =================
// GET /tasks
router.get("/tasks", taskController.listTasks);

// ================= NEW TASK FORM =================
// GET /clients/:id/tasks/new
router.get("/clients/:id/tasks/new", showNewTaskForm);

// ================= SAVE TASK =================
// POST /clients/:id/tasks
router.post("/clients/:id/tasks", createTask);

module.exports = router;
