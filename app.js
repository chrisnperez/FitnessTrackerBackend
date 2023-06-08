require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const apiRouter = require('./api');
const bodyParser = require('body-parser');


// Setup your Middleware and API Router here
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);

app.use((_req, res, next) => {
    res.status(404);
    res.send("Status code 404");
})

app.use((error, req, res, next) => {
    res.status(500);
    res.send(error.message);
})

module.exports = app;
