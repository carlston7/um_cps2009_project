// Authorization middleware
const requireAdmin = async (req, res, next) => {    
    const userEmail = req.header('User-Email');
    const userPassword = req.header('User-Password');

    // Ideally, these credentials should be stored securely and not hardcoded
    const adminEmail = 'admin@admin.admin';

    // Check if the email matches and password is correct
    if (userEmail === adminEmail) {
        if (userPassword === 'admin') {
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized: Incorrect password" });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized: User is not an admin" });
    }
};

module.exports = {requireAdmin};