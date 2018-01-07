
var backendHost = "https://linkboard-40e2e.firebaseio.com";// "http://localhost:3030";

function listDBLinks(boardHash, callback) {

	fetch(backendHost+'/links.json?orderBy="boardHash"&equalTo="'+boardHash+'"', {
		method: 'GET',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	}).then(function(res) {
		return res.json();
	}).then(function(body) {
		console.log("listDBLinks");

		callback(body);
	});
}

function updateBoard(boardObject, callback) {

	console.log(boardObject);
	
	fetch(backendHost+"/boards/"+boardObject.hash+".json", {
		method: 'PUT',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(boardObject)
	}).then(function(res) {
		return res.json();
	}).then(function(body) {

		var links = [];
		var storedNames = JSON.parse(localStorage.getItem("links"));
		if( storedNames !== null ) {
			links = storedNames;
		}

		for(var i in storedNames) {
			if(storedNames[i].hash == body.hash) {
				storedNames[i].name = body.name;
			}
		}

		localStorage.setItem("links", JSON.stringify(links));

		console.log("update board done");
		callback(body);
	});
}

function addDBLink(name, boardHash, url, posX, posY, callback) {

	fetch(backendHost+"/links.json", {
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( { name: name, boardHash: boardHash, url: url, posX:posX, posY:posY } )
	})
		.then(function(res) {

			return res.json();
		}).then(function(body) {

			var linkId = body.name;

			// GET
			fetch(backendHost+"/links/"+body.name+".json", {
				method: 'GET',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
			})
				.then(function(res) {
					return res.json();
				}).then(function(body) {
					console.log(body);
					callback(body, linkId);
			});

	});

}

function updateDBLink(newLinkObject, id, callback) {

	fetch(backendHost+"/links/"+id+".json", {
		method: 'PUT',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( newLinkObject )
	})
		.then(function(res) {
			return res.json();
		}).then(function(body) {
			callback(body);
	});

}

function removeDBLink(LinkObject, linkId, callback) {
	
	fetch(backendHost+"/links/"+linkId+".json", {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( LinkObject )
	})
		.then(function(res) {
			return res.json();
		}).then(function(body) {
			callback(body);
	});
}

export default module = {
	listDBLinks: listDBLinks,
	updateBoard: updateBoard,
	addDBLink: addDBLink,
	updateDBLink: updateDBLink,
	removeDBLink: removeDBLink
}