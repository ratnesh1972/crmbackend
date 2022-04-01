const express = require('express');
const User = require('../models/users');
const routes = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;
const authenticate = require('../middleware/authenticate');

//Getting user data for logged in user.
routes.get('/', authenticate, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        const { _id, username, firstname, lastname, type, role } = user;
        res.json({ _id, username, firstname, lastname, type, role });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


//Getting user logged in. Return JWT Token if credentials are correct.
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
                return res.status(400).json({ message: 'Incorrect Password!' });
            }
        } else {
            return res.status(400).json({ message: 'Incorrect Credentials!' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong..' });
    }
});

module.exports = routes;