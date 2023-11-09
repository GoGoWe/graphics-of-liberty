import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {loadObject} from "./helper/loader";
import {createStats, initStats, renderStats} from "./helper/stats"
import {rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
import {initCamera} from "./helper/camera";
import {initControls} from "./helper/controls";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import { FlyControls } from 'three/addons/controls/FlyControls.js';


//** Global constants and variables */
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();

let renderCount = 0;
let water, camera, controls;
let statue = null,
    sailboat = null,
    cargoship = null;

//** Configure renderer */
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );

//** Initialize the scene */
function init(){

    loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1, 0,
    0, 0, 0, -Math.PI / 2, 0).then(r => {
        statue = r;
    });

    loadObject('./public/sailingboat.glb', scene, loader, 1, 1, 1, -100,
        1, 0, 0, -Math.PI / 2, 0).then(r => {
            sailboat = r;
            //sailboat.orientationY=Math.PI/2;
        });

    loadObject('./public/boat_chris.glb', scene, loader, 1, 1, 1, 150,
        1, -50, 0, Math.PI / 3, 0).then(r => {
            cargoship = r;
        });


    camera = initCamera(innerWidth, innerHeight);
    water = initEnvironment(scene, renderer, camera);
    controls = initControls(camera, renderer);

    // Create statistics to show information like FPS, latency, ect.s
    initStats();

    // Update rendering on window resize
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}

function initOrbitControls(camera,renderer,movement, autoRotate) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 40, 0);
    controls.listenToKeyEvents(window);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.autoRotate = autoRotate;
    controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
    }
    controls.enabled = movement;
    controls.update()
    return controls;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "1") {
        if(controls instanceof OrbitControls) {
            controls.dispose();
            controls = initControls(camera, renderer);
        }
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "2") {
        if(controls instanceof FlyControls) {
            controls.dispose();
            initOrbitControls(camera,renderer, true, true);
        }
        if(controls.enabled === false){
            controls.enabled = true;
            controls.autoRotate = true;
        }
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "3") {
        if(controls instanceof FlyControls) {
            controls.dispose();
            controls = initOrbitControls(camera, renderer, false, false);
        }
        if(controls.enabled === true){
            controls.enabled = false;
            controls.autoRotate = false;
        }
        camera.position.set( -10, 15, 30 );
        controls.target.set(0,50,0);
        controls.update();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "4") {
        if(controls instanceof FlyControls) {
            controls.dispose();
            controls = initOrbitControls(camera, renderer, false, false);
        }
        if(controls.enabled === true){
            controls.enabled = false;
            controls.autoRotate = false;
        }
        camera.position.set( -20, 5, -170 );
        controls.target.set(0, 40, 0);
        controls.update();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "5") {
        if(controls instanceof FlyControls) {
            controls.dispose();
            controls = initOrbitControls(camera, renderer, false, false);
        }
        if(controls.enabled === true){
            controls.enabled = false;
            controls.autoRotate = false;
        }
        camera.position.set( -117, 8, -100 );
        controls.target.set(0, 25, -143);
        controls.update();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "6") {
        console.log(camera.position)
    }
});

//animate
//** Animation Function to update controls and animations recursively */
function animate() {
    const delta = clock.getDelta();
    controls.update(delta);
    requestAnimationFrame( animate );
    render();
}

//** Rendering Function invoked by the animation*/
function render() {
    renderCount += 1;
    const time = performance.now() / 10;
    rotate(sailboat, -time * 0.2, .1, Math.PI);
    rotate(cargoship, time, .9, Math.PI);
    water.material.uniforms['time'].value += 1.0 / 60.0;

    // Update statistics (FPS, latency, etc.)
    renderStats()
    renderer.render(scene, camera);

}

init();
animate();