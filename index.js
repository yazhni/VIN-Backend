const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');

require('dotenv').config();
require('./db/mongoose');
const users = require('./routes/userroutes')

//set up express

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', users)

const PORT = process.env.PORT || 2082
app.listen(PORT, () => console.log('Server Lisening On Port : ' + PORT));
