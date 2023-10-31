import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GUI} from "three/addons/libs/lil-gui.module.min";
import {loadObject} from "./helper/loader";
import {Sky} from "three/addons/objects/Sky";
import {Water} from "three/addons/objects/Water";
import {createStats, initStats, renderStats} from "./helper/stats"
import {TubePainter as starts} from "three/addons/misc/TubePainter";
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
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




//Sky

let sun = new THREE.Vector3();


const sky = new Sky();
sky.scale.setScalar( 10000000 );
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

function skyParamChanged(){
    const uniforms = sky.material.uniforms;
    renderer.toneMappingExposure = parameters.exposure;
    uniforms[ 'rayleigh' ].value = parameters.rayleigh;
    uniforms[ 'mieDirectionalG' ].value = parameters.mieDirectionalG;
}

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

function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    sceneEnv.add( sky );
    renderTarget = pmremGenerator.fromScene( sceneEnv );
    scene.add( sky );

    scene.environment = renderTarget.texture;

}

updateSun();


let statue=loadObject('./public/statue_of_liberty.glb', scene, loader,1,1,1,
    0,0,0,0,-Math.PI/2,0);

let sailboat=loadObject('./public/sailingboat.glb',scene,loader,1,1,1,50,
    1,0,0,Math.PI/3,0)

let cargoship=loadObject('./public/boat_chris.glb',scene,loader,1,1,1,50,
    1,-50,0,Math.PI/3,0)

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


const folderSky = gui.addFolder( 'Sky' );
renderer.toneMappingExposure=0.5;
folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
folderSky.add( parameters, 'exposure', 0, 1, 0.0001 ).onChange( skyParamChanged );
folderSky.add( parameters, 'rayleigh', 0.0, 4, 0.001 ).onChange( skyParamChanged );
folderSky.add( parameters, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( skyParamChanged );
folderSky.open();
skyParamChanged();

const waterUniforms = water.material.uniforms;

const folderWater = gui.addFolder( 'Water' );
waterUniforms.distortionScale.value=5;
folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
waterUniforms.size.value=20;
folderWater.add( waterUniforms.size, 'value', 5, 30, 0.1 ).name( 'size' );
folderWater.open();



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
function render() {



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



