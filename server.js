const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const index = require('./routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// global error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Something broke!')
})

var server = app.listen(process.env.PORT || 3000, () => console.log('App now running on port', server.address().port));