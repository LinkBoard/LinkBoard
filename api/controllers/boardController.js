'use strict';
var mongoose = require('mongoose'),
	Board = mongoose.model('Boards');

exports.list_all_boards = function(req, res) {
	Board.find({}, function(err, board) {
		if (err)
			res.send(err);
		res.json(board);
	});
};

exports.create_a_board = function(req, res) {
	var new_board = new Board(req.body);
	console.log(req.body);
	new_board.hash = Math.random().toString(36).substring(7);
	new_board.save(function(err, board) {
		if (err)
			res.send(err);
		res.json(board);
	});
};

exports.read_a_board = function(req, res) {
	Board.findOne({ 'hash': req.params.boardHash}, function (err, board) {
		if (err)
			res.send(err);
		res.json(board);
	});
	// Board.findById(req.params.boardId, function(err, board) {
	// 	if (err)
	// 		res.send(err);
	// 	res.json(board);
	// });
};

exports.update_a_board = function(req, res) {
	Board.findOneAndUpdate({ 'hash': req.params.boardHash}, req.body, {new: true}, function(err, board) {
		if (err)
			res.send(err);
		console.log(board);
		res.json(board);
	});
};

exports.delete_a_board = function(req, res) {
	// need hash impl.
	// Board.remove({
	// 	_id: req.params.boardId
	// }, function(err, board) {
	// 	if (err)
	// 		res.send(err);
	// 	res.json({ message: 'board successfully deleted' });
	// });
};
