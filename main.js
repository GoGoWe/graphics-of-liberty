import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GUI} from "three/addons/libs/lil-gui.module.min";
import {loadObject} from "./helper/loader";
import {Sky} from "three/addons/objects/Sky";
import {Water} from "three/addons/objects/Water";
import {createStats, initStats, renderStats} from "./helper/stats"
import {sin} from "three/nodes";
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




//Sky

let sun = new THREE.Vector3();
const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'mieCoefficient' ].value = 0.005;



const parameters = {
    elevation: 2,
    azimuth: -130,
    exposure: renderer.toneMappingExposure,
    rayleigh: 2,
    mieDirectionalG: 0.975,
};



const pmremGenerator = new THREE.PMREMGenerator( renderer );
const sceneEnv = new THREE.Scene();

let renderTarget;


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





let statue=null;
let sailboat=null;
let cargoship=null;
loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1,
    0, 0, 0, 0, -Math.PI / 2, 0).then(r => {statue=r;});
loadObject('./public/sailingboat.glb',scene,loader,1,1,1,50,
    1,0,0,Math.PI/3,0).then(r=>{sailboat=r;});
loadObject('./public/boat_chris.glb',scene,loader,1,1,1,50,
    1,-50,0,Math.PI/3,0).then(r=>{cargoship=r;})


initEnvironment(scene,renderer,parameters, sky, sun, water, sceneEnv,pmremGenerator);


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



