const express = require('express');
const Contact = require('../models/contacts');
const routes = express.Router();
const { validationResult, check } = require('express-validator');

routes.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.post('/', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('company').notEmpty().withMessage('Please enter company name'),
    check('phone').notEmpty().withMessage('Please enter phone number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, company, phone } = req.body;

        const contact = await new Contact({ name, company, phone });

        await contact.save();

        return res.json(contact);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.put('/:id', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('company').notEmpty().withMessage('Please enter company name'),
    check('phone').notEmpty().withMessage('Please enter phone number').isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        const { name, company, phone } = req.body;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found!' });
        }

        const newcontact = await Contact.findByIdAndUpdate(id, { $set: { name, phone, company } }, { new: true });

        res.json(newcontact);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;
        await Contact.findByIdAndDelete(id);
        res.json('Contact deleted successfully!');

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = routes;