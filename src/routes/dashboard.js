const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");

// Dashboard main page → stats load karega
router.get("/", getDashboardStats);

module.exports = router;
