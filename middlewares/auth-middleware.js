// Checks whether user is logged in
exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/auth/login");
    }

    next();
};

// Checks whether user is an admin
exports.requireAdmin = (req, res, next) => {
    // First, make sure user is logged in
    if (!req.session.userId) {
        return res.redirect("/auth/login");
    }

    // Then, make sure logged-in user has admin role
    if (req.session.role !== "admin") {
        return res.render("error-page", { error: "Access denied. Admins only." });
        // return res.status(403).send("Access denied. Admins only.");
    }

    next();
};