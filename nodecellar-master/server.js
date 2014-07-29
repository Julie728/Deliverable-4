var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var wine = require('./routes/wines');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
// session support
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'some secret here'
}));

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.listen(3000);
console.log('Express started on port 3000');