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
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    last_updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reg_date: {
        type: Date
    }
})

module.exports = mongoose.model('Lead', leadsSchema);