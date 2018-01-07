import Navigo from 'navigo'
//import fetch from 'node-fetch'; // = require('../lib/fetch').fetchUrl;

var root = null;
var useHash = true; // Defaults to: false
var hash = '#'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);
import initLandingPage from './landingpage/landingpage';
import page from './index';
var backendHost = "https://linkboard-40e2e.firebaseio.com/";// "http://localhost:3030";

router
	.on({
		'board/:id': function(params) {

			console.log(params.id);

			fetch(backendHost+"/boards/"+params.id+".json", {
				method: 'GET',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			}).then(function(res) {
					return res.json();
			}).then(function(body) {

				document.body.innerHTML = "";
				body.hash = params.id;
				page.initPage(body, router);

			});

		},
		'new': function () {

			fetch(backendHost+"/boards.json", {
					method: 'POST',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name: 'Set Title' })
				})
				.then(function(res) {
					return res.json();
				}).then(function(body) {

					console.log(body);

					var links = [];
					var storedNames = JSON.parse(localStorage.getItem("links"));
					if( storedNames !== null ) {
						links = storedNames;
					}
					links.push( { name: 'Set title', hash:body.name } );
					localStorage.setItem("links", JSON.stringify(links));

					router.navigate("/board/"+body.name, false)
			});
		},
		'': function() {

			if(page.returnRequestAnimationFrameId()!=null) {
				console.log('cancel animation frame');
				cancelAnimationFrame( page.returnRequestAnimationFrameId() );
			}

			console.log('cancel click events');
			document.body.removeEventListener( 'mousemove', page.onMouseMove, false );
			document.body.removeEventListener( 'click', page.onMouseClick, false );

			document.body.innerHTML = "";
			initLandingPage(router)
		}
	}).resolve();


window.addEventListener('popstate', function(event) {

		  var hashLocation = location.hash;
	      var hashSplit = hashLocation.split("#/");
	      var hashName = hashSplit[1];

	      if (hashName !== '') {
	        var hash = window.location.hash;
	        if (hash === '') {
	        	document.body.innerHTML = "";
	        }
	      }
});
