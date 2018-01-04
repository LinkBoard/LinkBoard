var express = require('express'),
	app = express(),
	port = process.env.PORT || 3030,
	mongoose = require('mongoose'),
	Link = require('./api/models/linkModel'), //created model loading here
	Board = require('./api/models/boardModel'), //created model loading here
	bodyParser = require('body-parser');
var cors = require('cors')

// // mongoose instance connection url connection
// mongoose.Promise =  mongoose.connect('mongodb://localhost/Linkdb', {
// 	useMongoClient: true,
// 	/* other options */
// });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Boarddb');

// = global.Promise;
//mongoose.connect('mongodb://localhost/Tododb');


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/apiRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);