function allowRoles(...roles) {
    return (req, res, next) => {

        // login check
        if (!req.session.user) {
            return res.redirect("/login");
        }

        // role check
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).send("Access Denied");
        }

        next(); // sab sahi → route allow
    };
}

module.exports = allowRoles;
