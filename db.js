const mongoose = require('mongoose');
const dbURI = process.env.DB_URL;

const connection = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    err ? console.log('DB Connection Error : ', err.message) : console.log('DB Connected successfully!');
})

module.exports = connection;