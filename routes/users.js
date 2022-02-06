const express = require('express');
const User = require('../models/users');
const routes = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;

routes.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({ id });
        res.json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
})

routes.post('/', [
    check('username').isEmail().withMessage('Please enter valid email'),
    check('firstname').notEmpty().withMessage('Please enter valid firstname'),
    check('lastname').notEmpty().withMessage('Please enter valid lastname'),
    check('password').notEmpty().withMessage('Please enter valid password'),
    check('type').notEmpty().withMessage('Please enter valid type'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, firstname, lastname, password, type } = req.body;

        let role;

        if (type === 'admin' || type === 'manager') {
            role = 'write'
        } else {
            role = req.body.role === '' ? 'read' : req.body.role;
        }


        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).send('User already exist!');
        }

        const hashedPass = await bcrypt.hash(password, 10);

        user = new User({
            username,
            firstname,
            lastname,
            password: hashedPass,
            type,
            role
        });

        await user.save();

        const payload = {
            user: {
                id: user._id,
                type: user.type,
                role: user.role
            }
        }
        const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 });
        res.json(token);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.post('/create', [
    check('username').isEmail().withMessage('Please enter valid email'),
    check('firstname').notEmpty().withMessage('Please enter valid firstname'),
    check('lastname').notEmpty().withMessage('Please enter valid lastname'),
    check('password').notEmpty().withMessage('Please enter valid password'),
    check('type').notEmpty().withMessage('Please enter valid type'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, firstname, lastname, password, type } = req.body;

        let role;

        if (type === 'admin' || type === 'manager') {
            role = 'write'
        } else {
            role = req.body.role === '' ? 'read' : req.body.role;
        }

        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).send('User already exist!');
        }

        const hashedPass = await bcrypt.hash(password, 10);

        user = new User({
            username,
            firstname,
            lastname,
            password: hashedPass,
            type,
            role
        });

        await user.save();

        res.json(user);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});


module.exports = routes;