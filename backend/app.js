const express = require('express');
const app = express();
app.use(express.json());

// importing productRoutes
const products = require('./routes/product');
const auth = require('./routes/auth');
// Root route
app.use('/api/v1', products);

app.use('/api/v1',auth);


module.exports = app;