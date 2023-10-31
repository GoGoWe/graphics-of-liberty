import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {loadObject} from "./helper/loader";
import {Water} from "three/addons/objects/Water";
import {createStats, initStats, renderStats} from "./helper/stats"
import {rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );











let statue=null;
let sailboat=null;
let cargoship=null;
loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1,
    0, 0, 0, 0, -Math.PI / 2, 0).then(r => {statue=r;});
loadObject('./public/sailingboat.glb',scene,loader,1,1,1,50,
    1,0,0,Math.PI/3,0).then(r=>{sailboat=r;});
loadObject('./public/boat_chris.glb',scene,loader,1,1,1,50,
    1,-50,0,Math.PI/3,0).then(r=>{cargoship=r;})


let water=initEnvironment(scene,renderer);


//set camera angle
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 5000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( 0, 80, 150 );




//set controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,40,0);
controls.listenToKeyEvents(window);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle=Math.PI/2;
controls.keys = {
    LEFT: 'ArrowLeft', //left arrow
    UP: 'ArrowUp', // up arrow
    RIGHT: 'ArrowRight', // right arrow
    BOTTOM: 'ArrowDown' // down arrow
}

controls.update()
document.addEventListener("keydown", function(event) {
    if (event.key === "1") {
        camera.position.set( 0, 80, 150 );
        controls.target.set(0,40,0);
        controls.update();
    }
});

const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.Audio( listener );

const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/seagulls.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.5 );
    sound.play();
});



//stats

createStats(renderer, scene, camera)
initStats()

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let renderZaehler=0;
function render() {
    renderZaehler+=1;
    const time = performance.now()/100000 ;
    rotate(sailboat, renderZaehler,0.1,Math.PI/2);
    rotate(cargoship,renderZaehler,1, Math.PI);
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderStats()
    renderer.render( scene, camera );

}

//animate
function animate() {
    controls.update()
    requestAnimationFrame( animate );
    render();

}

animate();



