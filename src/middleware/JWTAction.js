const jwt = require('jsonwebtoken');
const connection = require('../config/configDB');

require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    key = process.env.JWT_SECRET
    token = null;
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        let decoded = jwt.verify(token, key);//key,payload
        let user = await connection.User.findOne({ email: decoded.email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }

}
//verify
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.roleId)) {
            return res.status(403).json({ message: 'You do not have access' });
        }
        next();
    };
};


module.exports = {
    authMiddleware, authorize
}