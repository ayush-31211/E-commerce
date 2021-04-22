const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());


// importing productRoutes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
// Root route
app.use('/api/v1', products);

app.use('/api/v1',auth);

app.use('/api/v1',order);


module.exports = app;