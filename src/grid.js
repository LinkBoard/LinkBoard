import * as THREE from 'three';

export default function setupGrid() {

	var group = new THREE.Group();
	var planeMesh;

	//for(var level = 0; level <= 5; level++) {
			//console.log(Math.pow(10, level));	
			var pw = 10;
			//console.log(level);

			var material = new THREE.LineBasicMaterial({ color: 'rgb(200, 200, 200)' });

			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vector3(-pw*10, -pw*10, 0));
			geometry.vertices.push(new THREE.Vector3(pw*10, -pw*10, 0));
			geometry.vertices.push(new THREE.Vector3(pw*10, pw*10, 0));
			geometry.vertices.push(new THREE.Vector3(-pw*10, pw*10, 0));	
			geometry.vertices.push(new THREE.Vector3(-pw*10, -pw*10, 0));
			
			for(var x = -5; x <= 5; x++) {
				for(var y = -5; y <= 5; y++) {
					planeMesh = new THREE.Line( geometry, material );
					planeMesh.position.x = x*(pw*10);
					planeMesh.position.y = y*(pw*10);
					planeMesh.position.z = 0;
					group.add(planeMesh);
				}
			}
	//}

	return group;
}