const express = require('express');
const User = require('../models/users');
const routes = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;

routes.post('/', [
    check('username').isEmail().withMessage('Please enter valid email'),
    check('password').notEmpty().withMessage('Please enter valid password'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });

        if (user) {
            const compare = await bcrypt.compare(password, user.password)
            if (compare) {
                const payload = {
                    user: {
                        id: user._id,
                        type: user.type,
                        role: user.role
                    }
                }
                const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 });
                res.json(token);

            } else {
                return res.status(400).send('Incorrect Password!');
            }

        } else {
            return res.status(400).send('Incorrect Credentials!');
        }

    } catch (error) {
        res.status(500).send('Server Error');
    }
});


module.exports = routes;