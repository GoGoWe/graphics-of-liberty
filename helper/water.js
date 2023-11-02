import * as THREE from "three";
import {Water} from "three/addons/objects/Water";
export function initWater(scene){
let water, container;
container = document.getElementById( 'container' );

//Water

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( 'public/waternormals.jpg', function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 0,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;

scene.add( water );
return water;
}