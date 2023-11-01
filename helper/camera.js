import * as THREE from "three";
import {round} from "three/nodes";

export function initCamera(width, height){
//set camera angle

    const fov = 40;
    const aspect = width/height; // the canvas default
    const near = 0.1;
    const far = 5000;
    console.log(aspect)
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 80, 150 );

    return camera;
}