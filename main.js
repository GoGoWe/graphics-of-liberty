import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {loadObject} from "./helper/loader";
import {createStats, initStats, renderStats} from "./helper/stats"
import {rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
import {initCamera} from "./helper/camera";
import {initControls} from "./helper/controls";
import {initSound} from "./helper/sound";


const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );


let water, camera, controls;

let statue=null,
    sailboat=null,
    cargoship=null;
function init(){

    loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1,
        0, 0, 0, 0, -Math.PI / 2, 0).then(r => {
            statue=r;
        });

    loadObject('./public/sailingboat.glb',scene,loader,1,1,1,-100,
        1,0,0,-Math.PI/2,0).then(r=>{
            sailboat=r;
            //sailboat.orientationY=Math.PI/2;
        });
    loadObject('./public/boat_chris.glb',scene,loader,1,1,1,150,
        1,-50,0,Math.PI/3,0).then(r=>{
            cargoship=r;
        });


    water=initEnvironment(scene,renderer);


    camera=initCamera(innerWidth, innerHeight);
    controls=initControls(camera,renderer);

    initSound(camera);

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

let renderZaehler=0;
function render() {
    renderZaehler+=1;
    const time = performance.now()/10;
    rotate(sailboat, -time*0.75,.8,Math.PI);
    rotate(cargoship,time,.9, Math.PI);
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderStats()
    renderer.render( scene, camera );

}

//renderer.toneMapping=THREE.ACESFilmicToneMapping;

//animate
function animate() {
    controls.update()
    requestAnimationFrame( animate );
    render();

}

animate();