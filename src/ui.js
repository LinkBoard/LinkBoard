import * as THREE from 'three';
import DragControls from 'three-dragcontrols';
import TWEEN from '@tweenjs/tween.js'
import dataController from './dataController';

export function initButtons(glScene, camera, objects, glRenderer, data) {
	
	var inputWrapper = document.createElement("div");
	inputWrapper.className = "inputWrapper"

	// input
	var input = document.createElement("input");
	input.placeholder = "Paste your link here..";
	inputWrapper.appendChild(input);

	input.addEventListener("input", function () {
		if(input.value.length > 1) {
			input.className = 'openUp';
		} else {
			input.className = 'closeUp';
		}
	});

	// button
	var newLink = document.createElement("div");
	newLink.className = "addLink";
	newLink.innerHTML = "+";
	newLink.addEventListener("click", function() {

		if(input.value.length > 1) {

			//var name = prompt("Please give your link a title.", "");
			addLinkToScene(glScene, camera, objects, glRenderer, data, input.value);

		};

		input.value = '';
		input.className = 'closeUp';

  	});
	inputWrapper.appendChild(newLink);

	return inputWrapper;
}

export function initToolTip() {
	var toolTip = document.createElement("div");
	toolTip.className = "tooltip"
	toolTip.innerHTML = "";
	toolTip.style.display = 'none';
	toolTip.style.pointerEvents = 'none';
	return toolTip;
}

export function initLinkConfigToolTip(objects, glScene) {
	var toolTip = document.createElement("div");
	toolTip.className = "LinkConfigToolTip"
	toolTip.style.display = 'none';

	var deleteLinkButton = document.createElement("div");
	deleteLinkButton.className = "deleteLinkButton";
	deleteLinkButton.innerHTML = "Remove from board"; 
	deleteLinkButton.addEventListener( 'click', function () {

		var LinkConfigToolTip = document.body.getElementsByClassName("LinkConfigToolTip")[0];
		var linkObject = JSON.parse(decodeURIComponent(LinkConfigToolTip.getAttribute("data-linkObject")));
		var linkId = JSON.parse(decodeURIComponent(LinkConfigToolTip.getAttribute("data-id")));
		
		LinkConfigToolTip.style.display = 'none';

		dataController.removeDBLink(linkObject, linkId, function(output) {
			// 	console.log('done: remove link', output);
			for ( var i = 0; i < objects.length; i++ ) {
				if(linkObject._id == objects[i].userData.linkObject._id) {
					removeLink(objects[i], glScene);	

					// remove from objects list
					var idx = objects.indexOf(objects[i]);
				    if (idx !== -1) {
				        objects.splice(idx, 1);
				    }
				}

			}
		});

	});
	
	toolTip.appendChild(deleteLinkButton);
	
	return toolTip;
}

export function initRecentBoards(router) {
	var toolTip = document.createElement("div");
	toolTip.className = "recentBoards"
	toolTip.innerHTML = "Recent visited boards";
	toolTip.addEventListener( 'click', function () {
		router.navigate('', false);
	});

	return toolTip;
}

export function initFooter() {
	var toolTip = document.createElement("div");
	toolTip.className = "footer"
	toolTip.innerHTML = "<b>Controls</b><br/>Mouse click: open link<br/>Mouse wheel: zoom board<br/>Mouse drag: pan board or reposition link<br/>Mouse right-click: remove link<br/><br/><b>About</b><br/>Github: <a target='_blank' href='https://github.com/LinkBoard/LinkBoard'>LinkBoard</a><br/><br/><b>Share your feedback and feature requests <a target='_blank' href='https://github.com/LinkBoard/LinkBoard/issues'>here</a></b>";
	return toolTip;
}

function addLinkToScene(glScene, camera, objects, glRenderer, data, linkUrl) {
	dataController.addDBLink("empty", data.hash, linkUrl, -500+Math.random()*1000, -500+Math.random()*1000, function(linkObject, id) {
		showLink(glScene, camera, objects, glRenderer, data, linkObject, id);
	});
}

function showLink(glScene, camera, objects, glRenderer, data, linkObject, id) {

	var texture = new THREE.TextureLoader().load( "https://ucygetfavicon.appspot.com/"+linkObject.url ); // /assets/favicons/favicon.ico
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );

	var geometry = new THREE.CircleBufferGeometry( 16, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 'rgb(200,200,200)', map: texture } ); // 'rgb(255,192,203)'
	var circle = new THREE.Mesh( geometry, material );
	circle.position.x = linkObject.posX;
	circle.position.y = linkObject.posY;
	circle.position.z = 1000;
	circle.userData = { url: linkObject.url, hasBeenMoved: false, linkObject: linkObject, id: id };

	objects.push(circle);
	glScene.add(circle);

	var tween = new TWEEN.Tween(circle.position)
		.delay(20)
		.to({ z:0 }, 550)
		.easing(TWEEN.Easing.Elastic.Out)
		.onUpdate(function() {
		})
		.start();

	const dragControls = new DragControls(objects, camera, glRenderer.domElement);
}

function removeLink(object, glScene) {

	var tween = new TWEEN.Tween(object.position)
		.delay(0)
		.to({ y:object.position.y-25 }, 250)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function() {
		})
		.onComplete(function() {
			glScene.remove(object);
		})
		.start();

	object.material.transparent = true;
	var tweenOpacity = new TWEEN.Tween(object.material)
		.delay(0)
		.to({ opacity:0.0 },250)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function() {
		})
		.onComplete(function() {
			glScene.remove(object);
		})
		.start();	
}

export default module = {
    initButtons: initButtons,
	initRecentBoards: initRecentBoards,
	initFooter: initFooter,
    initToolTip: initToolTip,
    initLinkConfigToolTip: initLinkConfigToolTip,
	showLink: showLink
}