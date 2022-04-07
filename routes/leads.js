const express = require('express');
const Lead = require('../models/leads');
const User = require('../models/users');
const routes = express.Router();
const { validationResult, check } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const readauthorization = require('../middleware/readauthorization');
const writeauthorization = require('../middleware/writeauthorization');


routes.get('/', authenticate, readauthorization, async (req, res) => {
    try {
        const leads = await Lead.find({}).populate('created_by', 'firstname');
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...' });
    }
});

routes.post('/', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('company').notEmpty().withMessage('Please enter company name'),
    check('phone').notEmpty().withMessage('Please enter phone number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
    check('status').notEmpty().withMessage('Please enter valid status'),
], authenticate, writeauthorization, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, company, phone, status, created_by } = req.body;
        const lead = await new Lead({ name, company, phone, status, created_by });
        await lead.save();
        return res.json(lead);
    } catch (error) {
        json({ message: 'Something went wrong...' });
    }
});

routes.put('/:id', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('company').notEmpty().withMessage('Please enter company name'),
    check('phone').notEmpty().withMessage('Please enter phone number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
    check('status').notEmpty().withMessage('Please enter valid status'),
], authenticate, writeauthorization, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        const { name, company, phone, status } = req.body;
        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found!' });
        }
        const newlead = await Lead.findByIdAndUpdate(id, { $set: { name, company, phone, status } }, { new: true });
        res.json(newlead);
    } catch (error) {
        json({ message: 'Something went wrong...' });
    }
});

routes.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Lead.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        json({ message: 'Something went wrong...' });
    }
});

module.exports = routes;