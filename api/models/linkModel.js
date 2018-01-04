'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LinkSchema = new Schema({
	name: {
		type: String,
		required: 'Kindly enter the name of the link'
	},
	boardHash: {
		type: String,
		required: 'Kindly enter the boardHash of the link'
	},
	url: {
		type: String,
		required: 'Kindly enter the url of the link'
	},
	posX: {
		type: Number,
		required: 'Kindly enter the posX of the link'
	},
	posY: {
		type: Number,
		required: 'Kindly enter the posY of the link'
	}

});  // { name: a, boardHash: b, url:x, posX:0, posY:0 }

module.exports = mongoose.model('Links', LinkSchema);