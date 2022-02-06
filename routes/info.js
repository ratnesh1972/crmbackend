const express = require('express');
const Lead = require('../models/leads');
const Service = require('../models/services');
const Contact = require('../models/contacts');
const routes = express.Router();


routes.get('/', async (req, res) => {
    try {
        const leads_count = await Lead.find({}).count();
        const services_count = await Service.find({}).count();
        const contacts_count = await Contact.find({}).count();

        res.json({ leads_count, services_count, contacts_count });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = routes;