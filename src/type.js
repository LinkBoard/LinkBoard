import * as THREE from 'three';


export default function makeType(title, typeSize, x, y, z, scene, level, callback) {

	var loader = new THREE.FontLoader();
	loader.load( './assets/fonts/helvetiker_regular.typeface.json', function ( font ) {

		var xMid;
		var textShape = new THREE.BufferGeometry();
		var color = [level];
		var matDark = new THREE.LineBasicMaterial( {
			color: "rgb(200, 200, 200)",
			//side: THREE.DoubleSide,
			//transparent: true,
		} );
		var matLite = new THREE.MeshBasicMaterial( {
			color: "rgb(200, 200, 200)",
			//transparent: true,
			//opacity: 1,
		} );

		var message = title;
		var shapes = font.generateShapes( message, typeSize, 1 );
		var geometry = new THREE.ShapeGeometry( shapes );
		geometry.computeBoundingBox();
		xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		geometry.translate( xMid, 0, 0 );
		
		textShape.fromGeometry( geometry );
		var text = new THREE.Mesh( textShape, matLite );
		text.position.z = z;
		text.position.x = x;
		text.position.y = y;

		var geometryBox = new THREE.PlaneGeometry( geometry.boundingBox.max.x*2, geometry.boundingBox.max.y, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 'rgb(255, 255, 255)', transparent:true, opacity: 0.5, wireframe: false} );
		var boundingBox = new THREE.Mesh( geometryBox, material );
		boundingBox.position.y = geometry.boundingBox.max.y/2.0;
		
		callback(text, boundingBox, level);
	} );


}