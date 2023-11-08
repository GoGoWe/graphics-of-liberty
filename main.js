import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadObject } from "./helper/loader";
import { createStats, initStats, renderStats } from "./helper/stats"
import { rotate } from "./helper/animator";
import { initEnvironment } from "./helper/environment";
import { initCamera } from "./helper/camera";
import { initControls } from "./helper/controls";
import { startSound } from "./helper/sound";

//** Global constants and variables */
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
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
document.body.appendChild(renderer.domElement);

/** Initialization Function */
function init() {

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

//** Animation Function to update controls and animations recursively */
function animate() {
    controls.update()
    requestAnimationFrame(animate);
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