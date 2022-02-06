const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Lead', leadsSchema);