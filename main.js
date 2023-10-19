import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GUI} from "three/addons/libs/lil-gui.module.min";
import {loadObject} from "./helper/loader";
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
//set camera angle
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 0, 30, 150 );

//set controls
const controls = new OrbitControls(camera, renderer.domElement);
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

//set checker plane
const planeSize = 400;

const picloader = new THREE.TextureLoader();
const texture = picloader.load('./public/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);


let statue=loadObject('./public/statue_of_liberty.glb', scene, loader,1,1,1,
    0,0,0,0,0,0);

const geometry = new THREE.BoxGeometry( 100, 15, 100 );
const material = new THREE.MeshBasicMaterial( { color: 0x504030 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );



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

//animate
function animate() {
    requestAnimationFrame( animate );
    //scene.rotation.y+=0.01;
    controls.update();
    renderer.render( scene, camera );
}

animate();



