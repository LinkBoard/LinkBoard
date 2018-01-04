'use strict';

module.exports = function(app) {
	var linkList = require('../controllers/linkController');
	var boardList = require('../controllers/boardController');

	app.route('/links')
		.get(linkList.list_all_links)
		.post(linkList.create_a_link);

	app.route('/links/:linkId')
		.get(linkList.read_a_link)
		.put(linkList.update_a_link)
		.delete(linkList.delete_a_link);

	app.route('/boardlinks/:boardHash')
		.get(linkList.read_a_board)

	app.route('/boards')
		.get(boardList.list_all_boards)
		.post(boardList.create_a_board);

	app.route('/boards/:boardHash')
		.get(boardList.read_a_board)
		.put(boardList.update_a_board)
		.delete(boardList.delete_a_board);

};