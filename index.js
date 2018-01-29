const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const journals = require('./routes/journals')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

//Database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connecting to database: ', config.db);
  }
});

//Middleware
app.use(cors({
  origin: 'http://localhost:4200'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/journals', journals);

app.get('*', (req, res) => {
  // res.send('<h1>Francis World</h1>');
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});