// Authorization middleware
const requireAdmin = (req, res, next) => {
    const headers = req.headers;
    //test
    console.log(req.header['User-Type']);
    // Check if user is authenticated
    // if (!req.user) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // Check if user is an admin
    if (headers['User-Type'] !== "admin") {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        next(error);
    } else {
        // User is authenticated and is an admin, proceed to the next middleware or route handler
        next();
    }
};

module.exports = {requireAdmin};