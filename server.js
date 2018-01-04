const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);



// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.

app.get('/assets/fonts/helvetiker_regular.typeface.json', function(req, res){
  res.sendFile(__dirname + '/dist/assets/fonts/helvetiker_regular.typeface.json');
});

app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/dist/favicon.ico');
});

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath
}));


//app.use(express.static('dist/assets/three-orthographic-trackball-controls'));

// Serve the files on port 3000.
app.listen(3000, function () {
	console.log('Example app listening on port 3000!\n');
});