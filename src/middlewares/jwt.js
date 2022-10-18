const jwt = require("jsonwebtoken");

const getLogger = require('../utils/logger');
const logger = getLogger(__filename);


const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        const error_msg = { error: 'Access denied' }
        logger.error({ ...error_msg, url: req.url })
        return res.status(401).json(error_msg)
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        logger.error({ trace: error, url: req.url })
        res.status(400).json({ error: 'Token invalid or expired' })
    }
}

module.exports = verifyToken