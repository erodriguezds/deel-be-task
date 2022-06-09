const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { Op } = require("sequelize");

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

require("./routes/contracts")(app);
require("./routes/jobs")(app);
require("./routes/profiles")(app);
require("./routes/admin")(app);

module.exports = app;
