import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GUI} from "three/addons/libs/lil-gui.module.min";
import {loadObject} from "./helper/loader";
import {Sky} from "three/addons/objects/Sky";
import {Water} from "three/addons/objects/Water";
import {Euler} from "three";
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

function SceneManager(canvas) {
    // Magic goes here
}




function buildSky() {
    const sky = new Sky();

    sky.scale.setScalar(10000);
    scene.add(sky);
    return sky;
}
let sky= buildSky();
function buildSun() {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sun = new THREE.Vector3();

    // Defining the x, y and z value for our 3D Vector
    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    scene.environment = pmremGenerator.fromScene(sky).texture;
    return sun;
}
let sun=buildSun()
function buildWater() {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(
        waterGeometry,
        {
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals: new THREE.TextureLoader().load('', function ( texture ) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x =- Math.PI / 2;
    scene.add(water);

    const waterUniforms = water.material.uniforms;
    return water;
}
let water=buildWater();
//set checker plane
const planeSize = 400;



let statue=loadObject('./public/statue_of_liberty.glb', scene, loader,1,1,1,
    0,0,0,0,-Math.PI/2,0);

let sailboat=loadObject('./public/sailingboat.glb',scene,loader,1,1,1,50,
    1,0,0,Math.PI/3,0)

let cargoship=loadObject('./public/boat_chris.glb',scene,loader,1,1,1,50,
    1,50,0,Math.PI/3,0)

//Directional Light
const dircolor = 0xFFFFFF;
const dirintensity = 1;
const dirlight = new THREE.DirectionalLight( dircolor, dirintensity );
dirlight.position.set( 0, 10, 0 );
dirlight.target.position.set( -5, 0, 0 );
scene.add( dirlight );
scene.add( dirlight.target );

const amcolor = 0xFFFFFF;
const amintensity = 1;
const amlight = new THREE.AmbientLight( dircolor, dirintensity );
scene.add( amlight );


// generate parametersetter
const gui = new GUI();
gui.addColor(new ColorGUIHelper(dirlight, 'color'), 'value').name('color');
gui.add(dirlight, 'intensity', 0, 2, 0.01);
gui.add( dirlight.target.position, 'x', - 10, 10, .01 );
gui.add( dirlight.target.position, 'z', - 10, 10, .01 );
gui.add( dirlight.target.position, 'y', 0, 10, .01 );

gui.addColor(new ColorGUIHelper(amlight, 'color'), 'value').name('color');
gui.add(amlight, 'intensity', 0, 2, 0.01);


//set camera angle
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 0, 50, 150 );




//set controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,40,0);
controls.listenToKeyEvents(window);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.keys = {
    LEFT: 'ArrowLeft', //left arrow
    UP: 'ArrowUp', // up arrow
    RIGHT: 'ArrowRight', // right arrow
    BOTTOM: 'ArrowDown' // down arrow
}


document.addEventListener("keydown", function(event) {
    if (event.key === "1") {
        camera.position.set( 0, 100, 150 );
        controls.target.set(0,40,0);
        controls.update();
    }
});


//animate
function animate() {
    requestAnimationFrame( animate );
    //scene.rotation.y+=0.01;

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    controls.update();
    renderer.render( scene, camera );
}

animate();



