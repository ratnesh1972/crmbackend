const express = require('express');
const User = require('../models/users');
const routes = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');

//Register a user. Basic role will be read and type will be employee.
routes.post('/',
    [
        check('username').isEmail().withMessage('Please enter valid email'),
        check('firstname').notEmpty().withMessage('Please enter valid firstname'),
        check('lastname').notEmpty().withMessage('Please enter valid lastname'),
        check('password').notEmpty().withMessage('Please enter valid password')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, firstname, lastname, password } = req.body;

            const type = 'employee';
            const role = 'read';

            let user = await User.findOne({ username });

            if (user) {
                return res.status(400).json({ message: 'User already exist!' });
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

            res.json({ success: true });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong...' });
        }
    });

//Create new user with given permissions. Created either by admin or manager.
// routes.post('/create', [
//     check('username').isEmail().withMessage('Please enter valid email'),
//     check('firstname').notEmpty().withMessage('Please enter valid firstname'),
//     check('lastname').notEmpty().withMessage('Please enter valid lastname'),
//     check('password').notEmpty().withMessage('Please enter valid password'),
//     check('type').notEmpty().withMessage('Please enter valid type'),
// ], async (req, res) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { username, firstname, lastname, password, type } = req.body;

//         let role;

//         if (type === 'admin' || type === 'manager') {
//             role = 'write'
//         } else {
//             role = req.body.role === '' ? 'read' : req.body.role;
//         }

//         let user = await User.findOne({ username });

//         if (user) {
//             return res.status(400).send('User already exist!');
//         }

//         const hashedPass = await bcrypt.hash(password, 10);

//         user = new User({
//             username,
//             firstname,
//             lastname,
//             password: hashedPass,
//             type,
//             role
//         });

//         await user.save();

//         res.json(user);

//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });


module.exports = routes;