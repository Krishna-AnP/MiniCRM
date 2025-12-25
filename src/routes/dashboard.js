const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const allowRoles = require("../middleware/roleMiddleware");

// Dashboard main page → stats load karega
router.get(
    "/",
    allowRoles("superadmin", "admin"),
    getDashboardStats
);

module.exports = router;
