const express = require("express");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const clientsRoutes = require("./routes/clients");
const taskRoutes = require("./routes/tasks");
const invoiceRoutes = require("./routes/invoiceRoutes");


// Middleware
const ensureAuthenticated = require("./middleware/authMiddleware");

const app = express();

/* ======================
   BODY PARSERS (VERY IMPORTANT)
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ======================
   SESSION
====================== */
app.use(
  session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);


/* ======================
   MAKE USER AVAILABLE TO ALL EJS FILES
====================== */
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


/* ======================
   VIEW ENGINE
====================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(expressLayouts);
app.set("layout", "layout");

/* ======================
   STATIC FILES
====================== */
app.use(express.static(path.join(__dirname, "../public")));

/* ======================
   PUBLIC ROUTES
====================== */
app.use("/", authRoutes);

/* ======================
   AUTH MIDDLEWARE
====================== */
app.use(ensureAuthenticated);

/* ======================
   PROTECTED ROUTES
====================== */
app.use("/dashboard", dashboardRoutes);
app.use("/clients", clientsRoutes);
app.use("/", taskRoutes);
app.use("/", invoiceRoutes);
app.use("/", require("./routes/contacts"));

/* ======================
   DEFAULT ROUTE
====================== */
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
