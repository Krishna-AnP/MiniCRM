const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db");

// GET /login → Login page show
router.get("/login", (req, res) => {
    res.render("login", { layout: false, error: null });
});

// POST /login → Login check
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check user email in DB
    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, [email], async (err, user) => {
        if (err) {
            console.log(err);
            return res.render("login", { error: "Database error" });
        }

        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.render("login", { error: "Invalid email or password" });
        }

        // ⭐ Set session (ROLE ADDED)
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        req.session.save(() => {
            res.redirect("/dashboard");
        });
    });
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
