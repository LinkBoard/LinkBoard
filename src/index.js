import _ from 'lodash'
import './style.css'
import setupGrid from './grid.js'
import UI from './ui.js'
import * as THREE from 'three';
import './assets/mods/three-orthographic-trackball-controls';
import TWEEN from '@tweenjs/tween.js'
import makeType from './type.js'
import dataController from './dataController';

var camera, glScene, glRenderer, controls;
var mouse, mouseRelative, raycaster, mouseClick;
var requestAnimationFrameid = null;
var objects = [];
var boundingBoxTitle = [];
var pageTitle = [];
var boardObject = null;

import dataController from './dataController';

function initPage(data, router) {

	console.log("data", data);

	document.body.appendChild(init(data));
	controls = new THREE.OrthographicTrackballControls(camera, glRenderer.domElement)

	document.body.appendChild(UI.initButtons(glScene, camera, objects, glRenderer, data));
	document.body.appendChild(UI.initToolTip());
	document.body.appendChild(UI.initFooter());
	document.body.appendChild(UI.initLinkConfigToolTip(objects, glScene));
	
	document.body.appendChild(UI.initRecentBoards(router));

	document.body.addEventListener( 'mousemove', onMouseMove, false );
	document.body.addEventListener( 'click', onMouseClick, false );
	document.body.addEventListener( 'mousedown', onMouseClick, false );
	
	// drag solving
	document.body.addEventListener( 'mouseup', onMouseUp, false );
	document.body.addEventListener( 'mousedown', onMouseDown, true );

	animate();
	document.body.addEventListener('resize', onWindowResize, false );

	// console.log("LOAD NEW DATA, WITH HASH: " + data.hash);
	dataController.listDBLinks(data.hash, function (linksList) {
		for(const a in linksList) {
			UI.showLink(glScene, camera, objects, glRenderer, data, linksList[a], a)
		}
	})
}

function init(data) {

	objects = [];
	boundingBoxTitle = [];
	pageTitle = [];
	camera = null;
	glScene  = null;
	glRenderer  = null;
	controls  = null;
	boardObject = data;
	// console.log('board', boardObject);

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;

	raycaster = new THREE.Raycaster();

	mouse = new THREE.Vector2();
	mouseRelative = new THREE.Vector2();
	mouseClick = new THREE.Vector2();

	glScene = new THREE.Scene();
	glRenderer = new THREE.WebGLRenderer( { antialias:true, alpha: true });
	glRenderer.setPixelRatio( window.devicePixelRatio );
	glRenderer.setSize( window.innerWidth, window.innerHeight );

	var grid = setupGrid();
	glScene.add(grid);

	makeType(data.name, 50, 0, 0, 0, glScene, 0, function(text, boundingBox, levelValue) {
		boundingBoxTitle.push(boundingBox);
		pageTitle.push(text);
		glScene.add(boundingBox);
		glScene.add(text);
	});

	mouse.x = Math.random();
	mouse.y = Math.random();

	return glRenderer.domElement;
}

function animate(time) {
	requestAnimationFrameid = requestAnimationFrame( animate );
	
	if(camera.position.z < 500) {
       camera.position.z = 500;
    }
    if(camera.position.z > 1500) {
       camera.position.z = 1500
    }

	glRenderer.setClearColor( 0x000000, 0 );
	glRenderer.render( glScene, camera );
	controls.update();
	TWEEN.update(time);

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );
	var tooltip = document.body.getElementsByClassName("tooltip")[0];

	for ( var i = 0; i < objects.length; i++ ) {
		objects[i].material.color.set('rgb(255,255,255)'); // 'rgb(255,92,103)'
		if(tooltip) {
			tooltip.style.display = 'none';
		}
	}

	for ( var i = 0; i < intersects.length; i++ ) {
		tooltip.style.display = 'block';
		intersects[i].object.material.color.set('rgb(0,0,255)');
		var tooltipWidth = tooltip.offsetWidth;
		var tooltipHeight = tooltip.offsetHeight;
		tooltip.innerHTML = "↪ "+intersects[i].object.userData.url;// + " moved state:" + intersects[i].object.userData.hasBeenMoved;// ( DEBUG )
		tooltip.style.left = (mouseRelative.x - tooltipWidth / 2) + "px";
		tooltip.style.top = (mouseRelative.y - tooltipHeight * 1.5) + "px";
	}

	for ( var i = 0; i < boundingBoxTitle.length; i++ ) {
		//console.log('set white');
		boundingBoxTitle[i].material.color.set('rgb(250, 250, 250)');
	}

	var intersectsTitle = raycaster.intersectObjects( boundingBoxTitle );

	for ( var i = 0; i < intersectsTitle.length; i++ ) {
		//console.log('set grey');	
		intersectsTitle[i].object.material.color.set('rgb(200,200,200)');
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	mouseRelative.x = event.clientX;
	mouseRelative.y = event.clientY;

	// raycaster.setFromCamera( mouse, camera );

	// var intersects = raycaster.intersectObjects( objects );

	// if(intersects.length>0) {
	// 	controls.dragLock = true;
	// } else {
	// 	// controls.dragLock = false;
	// 	//controls.dragLock = false;
	// }
}

function onMouseDown(event) {

	controls.dragLock = false;

	mouseClick.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseClick.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouseClick, camera );

	var intersects = raycaster.intersectObjects( objects );

	if(intersects.length>0) {

		controls.dragLock = true;
		
		if(event.which == 3 ) { 

			var LinkConfigToolTip = document.body.getElementsByClassName("LinkConfigToolTip")[0];
			
			LinkConfigToolTip.style.display = 'block';
			LinkConfigToolTip.setAttribute('data-linkObject', encodeURIComponent(JSON.stringify(intersects[0].object.userData.linkObject)));
			LinkConfigToolTip.setAttribute('data-id', encodeURIComponent(JSON.stringify(intersects[0].object.userData.id)));
			//console.log(intersects[0].object.userData.linkObject);
			LinkConfigToolTip.style.left = (event.clientX + 20) + "px";
			LinkConfigToolTip.style.top = (event.clientY - 20) + "px";

		}
	} 

	

}

function onMouseUp(event) {

	if(event.which != 3 ) { 
		var LinkConfigToolTip = document.body.getElementsByClassName("LinkConfigToolTip")[0];
		LinkConfigToolTip.style.display = 'none';
	}
	//console.log('draglock false');
	controls.dragLock = false;
}

function onMouseClick( event ) {

	mouseClick.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseClick.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouseClick, camera );

	var intersects = raycaster.intersectObjects( objects );

	if(intersects.length>0) {
		
		//console.log(intersects[0].object.userData.hasBeenMoved);
		if(intersects[0].object.userData.hasBeenMoved == false ) {
				
			var win = window.open(intersects[0].object.userData.url, '_blank');
			win.focus();

		} else {
			
			// update location
			var newLinkObject = intersects[0].object.userData.linkObject;
			newLinkObject.posX = intersects[0].object.position.x;
			newLinkObject.posY = intersects[0].object.position.y;
			
			dataController.updateDBLink(newLinkObject, intersects[0].object.userData.id, function(output) {
				//console.log('done: updated link', output);
			});

		}
	}
	
	var intersectsTitle = raycaster.intersectObjects( boundingBoxTitle );
	for ( var i = 0; i < intersectsTitle.length; i++ ) {
		var newTitle = prompt("Please enter title", "");
		if (newTitle != null) {
			SetNewTitle(newTitle);
    	}
	}
}

function SetNewTitle(newTitle) {
	boardObject.name = newTitle;
	dataController.updateBoard(boardObject, function(output) {

		glScene.remove(boundingBoxTitle[0]);
		glScene.remove(pageTitle[0]);

		boundingBoxTitle = [];
		pageTitle = [];

		makeType(output.name, 50, 0, 0, 0, glScene, 0, function(text, boundingBox, levelValue) {
			boundingBoxTitle.push(boundingBox);
			pageTitle.push(text);
			glScene.add(boundingBox);
			glScene.add(text);
		});

	});
}

function returnRequestAnimationFrameId() {
	return requestAnimationFrameid;
}

function mapValue(value, in_min, in_max, out_min, out_max) {
		return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export default module = {
	initPage: initPage,
	onMouseClick: onMouseClick,
	onMouseMove: onMouseMove,
	returnRequestAnimationFrameId: returnRequestAnimationFrameId
}
