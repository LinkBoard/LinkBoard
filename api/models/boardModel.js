'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
	hash: {
		type: String,
		default: null
	},
	name: {
		type: String,
		required: 'Kindly enter the name of the board'
	}
});



module.exports = mongoose.model('Boards', BoardSchema);