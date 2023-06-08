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

// app.get('/products/:id', function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for all origins!'})
//   })
  
//   app.listen(80, function () {
//     console.log('CORS-enabled web server listening on port 80')
//   })

module.exports = app;
