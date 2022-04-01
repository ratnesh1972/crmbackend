const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;
const User = require('../models/users');


const authenticate = async (req, res, next) => {
    const token = req.header('X-Auth-Token');

    try {
        if (!token) {
            return res.status(401).send('Invalid Token!');
        }

        const decoded = jwt.verify(token, secret);

        req.user = decoded.user;

        next();

    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = authenticate;