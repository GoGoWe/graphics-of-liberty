import * as THREE from "three";
import { Water } from "three/addons/objects/Water";

/** 
 * Creates an plane, applies a water shader to it and add it to the scene
 * @param {THREE.Scene} scene - The scene the water plane should be added to 
 * @returns 
 */
export function initWater(scene) {
    // Water plane 
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    let water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('public/waternormals.jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x003399,
        distortionScale: 0,
        fog: scene.fog !== undefined
    });

    water.rotation.x = - Math.PI / 2;

    scene.add(water);
    return water;
}