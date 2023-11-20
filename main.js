import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {loadObject} from "./helper/loader";
import {animateParticles, createConfetti, rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
import {initCamera} from "./helper/camera";
import { initOrbitControls, initFlyControls, initUIControls } from "./helper/controls";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {FlyControls} from 'three/addons/controls/FlyControls.js';
import {initStats, renderStats} from "./helper/stats";


//** Global constants and variables */
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
const confettiParticles = [];
const confetti = new THREE.Group();
const confettiRay = new THREE.Raycaster(undefined, undefined, 0, undefined)
const collisionRay = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let timeAfterCollision = Date.now()  + 1000;
let intersects;
let water, camera, controls;
let statue = null,    sailboat = null,    cargoship = null,    yanBoat=null;

//** Configure renderer */
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);

//** Initialize the scene */
function init() {

    var nullVec = new THREE.Vector3()
    var origScale = new THREE.Vector3(1,1,1);
    var x3Scale = new THREE.Vector3(3,3,3);
    var origRot = new THREE.Quaternion(0, -Math.PI / 2, 0)
    var posSail = new THREE.Vector3(-100, -1, 0);
    var posCargo = new THREE.Vector3(150, 1, -50);
    var posBigCargo = new THREE.Vector3(150,0,0)

    loadObject('./public/statue_of_liberty.glb', scene, loader, origScale, nullVec, origRot).then(r => {
        statue = r;
        statue.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.selfShadow=true;
            }
        });
    });

    loadObject('./public/sailingboat.glb', scene, loader, origScale, posSail, origRot).then(r => {
            sailboat = r;
    });

    loadObject('./public/BOAT_anim.glb', scene, loader, origScale, posCargo,origRot).then(r => {
                cargoship = r;
    });
        
    loadObject('./public/BOAT_anim.glb',scene,loader, x3Scale, posBigCargo, origRot).then(r=>{
        yanBoat=r;
    });

    camera = initCamera(innerWidth, innerHeight);
    water = initEnvironment(scene, renderer, camera);
    controls = initFlyControls(camera, renderer);

    // Create statistics to show information like FPS, latency, ect.s
    initStats();
    // Initialize UI control elements
    initUIControls();

    // Update rendering on window resize
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}

//** Event listener for keydown events to change camera position*/
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "1":
            if (controls instanceof OrbitControls) {
                controls.dispose();
                controls = initFlyControls(camera, renderer);
            }
            document.getElementById("status").textContent="Flight";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,0)";
            break;
        case "2":
            if (controls instanceof FlyControls) {
                controls.dispose();
                controls = initOrbitControls(camera, renderer, true, false);
            }
            controls.enabled = true;
            controls.maxPolarAngle = Math.PI/2;
            controls.autoRotate = false;
            document.getElementById("status").textContent="Orbit";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,0)";
            break;
        case "3":
            if (controls instanceof FlyControls) {
                controls.dispose();
                initOrbitControls(camera,renderer, false, true);
            }else {
                controls.enabled = false;
                controls.maxPolarAngle = Math.PI;
                controls.autoRotate = !controls.autoRotate; // TODO: Should this rely be toggled i would remove this else completely
                document.getElementById("status").textContent = controls.autoRotate ? "AutoP" : "Locked";
            }
            document.getElementById("mainTitle").style.color="rgba(1,1,1,1)";

            camera.position.set(0, 80, 200);
            controls.target.set(0, 40, 0);
            break;
        case "4":
            if (controls instanceof FlyControls) {
                controls.dispose();
                controls = initOrbitControls(camera, renderer, false, false);
            }
            controls.enabled = false;
            controls.maxPolarAngle = Math.PI;
            controls.autoRotate = false;
            document.getElementById("status").textContent="Locked";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,1)";

            camera.position.set(-20, 5, -170);
            controls.target.set(0, 40, 0);
            break;
        case "5":
            if (controls instanceof FlyControls) {
                controls.dispose();
                controls = initOrbitControls(camera, renderer, false, false);
            }
            controls.enabled = false;
            controls.maxPolarAngle = Math.PI;
            controls.autoRotate = false;
            document.getElementById("status").textContent="Locked";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,1)";

            camera.position.set(-117, 8, -100);
            controls.target.set(0, 25, -143);
            break;
        case "6":
            if (controls instanceof FlyControls) {
                controls.dispose();
                controls = initOrbitControls(camera, renderer, false, false);
            }
            controls.enabled = false;
            controls.maxPolarAngle = Math.PI;
            controls.autoRotate = false;
            document.getElementById("status").textContent="Locked";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,0)";

            camera.position.set(-10, 15, 30);
            controls.target.set(0, 55, 0);
            break;
    }

});

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        collisionRay.setFromCamera( pointer, camera );
        intersects = collisionRay.intersectObjects( scene.children );
        let position = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        confettiParticles.push(createConfetti(position,confetti));
        if (confettiParticles.length > 30){
            confetti.remove(confetti.children[0]);
            confettiParticles.shift();
        }
    }
});

scene.add(confetti);

/** Should be invoked when a collision is detected 
  * @param {string} freeCollisionKey - The key that need to be pressed to enable controls again   
  */
function collisionDetected(freeCollisionKey) {
    let speedTemp = controls.movementSpeed;
    controls.movementSpeed = 0;
    console.log("Press " + freeCollisionKey + " to free the camera");
    document.getElementById("status").textContent="Tap S";

    // Wait for keypress before enabling controls again
    document.addEventListener("keydown", function freeCollision(event) {
        if (event.key === freeCollisionKey) {
            timeAfterCollision = Date.now();
            console.log(speedTemp)
            controls.movementSpeed = 50;
            document.removeEventListener("keydown", freeCollision);
            document.getElementById("status").textContent="Flight";
        }
    });

}

//** Animation Function to update controls and animations recursively */
function animate() {
    const delta = clock.getDelta();
    if (controls instanceof FlyControls) {
        confettiRay.setFromCamera(new THREE.Vector3(0, 0, 0), camera);
        var collisionResults = confettiRay.intersectObjects(scene.children, true);
        if (collisionResults.length > 0 && collisionResults[0].distance < 10 && Date.now() - timeAfterCollision > 50) {
            collisionDetected("s");
        }
    }
    animateParticles(confettiParticles);
    controls.update(delta);
    requestAnimationFrame(animate);
    render();
}

//** Rendering Function invoked by the animation*/
function render() {
    const time = performance.now();
    rotate(sailboat, -time, .4, Math.PI, -100,
        0.6, 0);
    rotate(cargoship, time * 2 / 3, .9, 0, 150,
        1, -50);
    rotate(yanBoat, time / 8, 9.5, Math.PI, 50,
        1.1, -100);
    water.material.uniforms['time'].value += 1.0 / 60.0;
    renderStats()
    renderer.render(scene, camera);
}


// Application Entry Point
init();
animate();