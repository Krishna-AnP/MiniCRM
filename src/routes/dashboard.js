const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const allowRoles = require("../middleware/roleMiddleware");

// Dashboard main page → stats will load 
router.get(
    "/",
    allowRoles("superadmin", "admin", "user"),
    getDashboardStats
);

module.exports = router;
