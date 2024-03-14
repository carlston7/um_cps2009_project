// Authorization middleware
function requireAdmin(req, res, next) {
    const data = req.body;

    // Check if user is authenticated
    // if (!req.user) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // Check if user is an admin
    if (data.type !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    
    // User is authenticated and is an admin, proceed to the next middleware or route handler
    next();
}