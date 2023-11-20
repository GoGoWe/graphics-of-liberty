import * as THREE from "three";

/** Initialize the camera by creating it and placing it into the scene 
 *  @param {int} height - The camera ascpact ration
 *  @param {int} width  - The camera ascpect ration
*/
export function initCamera(width, height){
    const fov = 40;
    const aspect = width/height; // the canvas default
    const near = 0.1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 80, 150 );
    camera.rotateX(-Math.PI/16)
    return camera;
}