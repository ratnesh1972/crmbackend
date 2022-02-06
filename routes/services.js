const express = require('express');
const Service = require('../models/services');
const routes = express.Router();
const { validationResult, check } = require('express-validator');

routes.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.post('/', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('description').notEmpty().withMessage('Please enter service description'),
    check('status').notEmpty().withMessage('Please enter valid status'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description, status } = req.body;

        const service = await new Service({ name, description, status });

        await service.save();

        return res.json(service);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.put('/:id', [
    check('name').notEmpty().withMessage('Please enter valid name'),
    check('description').notEmpty().withMessage('Please enter service description'),
    check('status').notEmpty().withMessage('Please enter valid status'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        const { name, description, status } = req.body;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found!' });
        }

        const newservice = await Service.findByIdAndUpdate(id, { $set: { name, description, status } }, { new: true });

        res.json(newservice);

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

routes.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;
        await Service.findByIdAndDelete(id);
        res.json('Service deleted successfully!');

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = routes;