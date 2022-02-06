if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const connection = require('./db');
const app = express();


app.use(express.json());
connection;

//Routes for leads API endpoints - /api/leads
app.use('/api/leads', require('./routes/leads'));

//Routes for contacts API endpoints - /api/contacts
app.use('/api/contacts', require('./routes/contacts'));

//Routes for services API endpoints - /api/services
app.use('/api/services', require('./routes/services'));

//Routes for info API endpoints - /api/info
app.use('/api/info', require('./routes/info'));

//Routes for users API endpoints - /api/users
app.use('/api/users', require('./routes/users'));

//Routes for auth API endpoints - /api/auth
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT || 5000, () => {
    console.log('App is running on :', process.env.PORT || 5000);
})