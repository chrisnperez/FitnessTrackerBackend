require("dotenv").config()
const express = require("express")
const app = express()
const apiRouter = require('./api');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')


// Setup your Middleware and API Router here
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', apiRouter);

app.use("*", (_req, res, next) => {
    res.status(404);
    res.send({message: "Status code 404"});
})

app.use((error, req, res, next) => {
    res.status(500);
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    });
})

module.exports = app;
