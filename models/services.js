const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Service', servicesSchema);