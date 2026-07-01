const jwt = require("jsonwebtoken");

//
// ===============================
// PROTECT ROUTE (AUTH CHECK)
// ===============================
const protect = (req, res, next) => {
    let token = req.headers.authorization;

    // ❌ No token provided
    if (!token) {
        return res.status(401).json({
            message: "No token, access denied"
        });
    }

    // ❌ Must be Bearer token
    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {
        // Remove "Bearer "
        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user to request
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Token is invalid or expired"
        });
    }
};

//
// ===============================
// ADMIN ONLY MIDDLEWARE
// ===============================
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();
};

//
// ===============================
// EXPORT
// ===============================
module.exports = {
    protect,
    adminOnly
};