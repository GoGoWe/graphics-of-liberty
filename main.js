import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {loadObject} from "./helper/loader";
import {createStats, initStats, renderStats} from "./helper/stats"
import {rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
import {initCamera} from "./helper/camera";
import {initControls} from "./helper/controls";
import {startSound} from "./helper/sound";

const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );
const clock = new THREE.Clock();

let water, camera, controls;

let statue=null,
    sailboat=null,
    cargoship=null;
function init(){

    loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1,
        0, 0, 0, 0, -Math.PI / 2, 0).then(r => {
            statue=r;
        });

    loadObject('./public/sailingboat.glb',scene,loader,1,1,1,0,
        0,0,0,-Math.PI/2,0).then(r=>{
            sailboat=r;
            //sailboat.orientationY=Math.PI/2;
        });
    loadObject('./public/boat_chris.glb',scene,loader,1,1,1,0,
        0,0,0,Math.PI/3,0).then(r=>{
            cargoship=r;
        });


    camera=initCamera(innerWidth, innerHeight);

    water=initEnvironment(scene,renderer,camera);

    controls = initControls(camera, renderer);

    //stats

    createStats(renderer, scene, camera);
    initStats();


    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }
}

init();



function render() {
    const time = performance.now();
    rotate(sailboat, time,.4,Math.PI,-100,
        0.85,0);
    rotate(cargoship,time*2/3,.9, 0,150,
        1,-50);
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderStats()
    renderer.render( scene, camera );

}

//renderer.toneMapping=THREE.ACESFilmicToneMapping;

//animate
function animate() {
    const delta = clock.getDelta();
    console.log(controls);
    controls.movementSpeed = 50;
    controls.update(delta);
    requestAnimationFrame( animate );
    render();
}

animate();