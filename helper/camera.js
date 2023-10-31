import * as THREE from "three";

export function initCamera(renderer){
//set camera angle

    const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 5000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 0, 80, 150 );

return camera

}