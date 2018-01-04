import Navigo from 'navigo'
import './landingpage.css'

export default function initLandingPage(router) {

	document.body.appendChild(createNewBoardButton(router));
	document.body.appendChild(recentBoardsList(router));
}

function createNewBoardButton(router) {

	var startWrapper = document.createElement("div");
	startWrapper.className = "startWrapper"
	startWrapper.innerHTML = "Create new board";
	startWrapper.addEventListener( 'click', function () {
		router.navigate('/new', false);
	});

	return startWrapper;
}

function recentBoardsList(router) {

	var recentWrapper = document.createElement("div");
	recentWrapper.className = "recentWrapper"
	recentWrapper.innerHTML = "Recent boards";

	var recentContainer = document.createElement("div");
	recentContainer.className = "recentContainer"

	var storedNames = JSON.parse(localStorage.getItem("links"));
	storedNames.sort((a, b) => a.name.localeCompare(b.name));

	if(storedNames !== null) {

		for (var i in storedNames) {
			var link = storedNames[i];

			var recentBoard = document.createElement("div");
			recentBoard.className = "recentBoard"
			recentBoard.innerHTML = link.name;// + "<br/><small>/" + link.hash + "</small>";
			recentBoard.setAttribute('data-hash', link.hash);

			recentBoard.addEventListener('click', function () {
				router.navigate('/board/' + this.getAttribute('data-hash'), false);
			});

			recentContainer.appendChild(recentBoard);
		}
	} else {

		// none
		var emptyWrapper = document.createElement("div");
		emptyWrapper.className = "emptyWrapper"
		emptyWrapper.innerHTML = "None";
		recentContainer.appendChild(emptyWrapper);

	}

	recentWrapper.appendChild(recentContainer);
	return recentWrapper;
}
