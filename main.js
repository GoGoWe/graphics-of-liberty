import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {loadObject} from "./helper/loader";
import {createStats, initStats, renderStats} from "./helper/stats"
import {animateParticles, createConfetti, rotate} from "./helper/animator";
import {initEnvironment} from "./helper/environment";
import {initCamera} from "./helper/camera";
import {initControls} from "./helper/controls";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {FlyControls} from 'three/addons/controls/FlyControls.js';


//** Global constants and variables */
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();
let ray = new THREE.Raycaster(undefined, undefined, 0, undefined)
let timeAfterCollision = Date.now();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let intersects;
let confetti = new THREE.Group();
let confettiParticles = [];

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

    loadObject('./public/statue_of_liberty.glb', scene, loader, 1, 1, 1, 0,
        0, 0, 0, -Math.PI / 2, 0).then(r => {
        statue = r;
        statue.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                object.selfShadow=true;
            }
        });
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
    loadObject('./public/BOAT_anim.glb',scene,loader,3,3,3,0,
        100,0,0,-Math.PI/2,0).then(r=>{
        yanBoat=r;
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

function initOrbitControls(camera, renderer, movement, autoRotate) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 40, 0);
    controls.listenToKeyEvents(window);
    controls.enableDamping = false;
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

//** Event listener for keydown events to change camera position*/
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "1":
            if (controls instanceof OrbitControls) {
                controls.dispose();
                controls = initControls(camera, renderer);
            }
            document.getElementById("status").textContent="Flight";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,0)";
            break;
        case "2":
            if(controls instanceof FlyControls) {
                controls.dispose();
                controls = initOrbitControls(camera, renderer, true, false);
            }
            controls.enabled = true;
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
            controls.autoRotate = false;
            document.getElementById("status").textContent="Locked";
            document.getElementById("mainTitle").style.color="rgba(1,1,1,0)";

            camera.position.set(-10, 15, 30);
            controls.target.set(0, 55, 0);
            break;
    }

});

function collisionDetected(freeCollisionKey) {
    controls.enabled = false;
    controls.dispose();
    console.log("Press " + freeCollisionKey + " to free the camera");
    document.getElementById("status").textContent="Tap S";

    // Wait for keypress s before enabling controls again
    document.addEventListener("keydown", function freeCollision(event) {
        if (event.key === freeCollisionKey) {
            timeAfterCollision = Date.now();
            controls = initControls(camera, renderer);
            controls.enabled = true;
            document.removeEventListener("keydown", freeCollision);
            document.getElementById("status").textContent="Flight";
        }
    });

}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        raycaster.setFromCamera( pointer, camera );
        intersects = raycaster.intersectObjects( scene.children );
        let position = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        confettiParticles.push(createConfetti(position,confetti));
        console.log(confettiParticles);
        if (confettiParticles.length > 30){
            confetti.remove(confetti.children[0]);
            confettiParticles.shift();
        }
    }
});

scene.add(confetti);

//** Animation Function to update controls and animations recursively */
function animate() {
    const delta = clock.getDelta();
    if (controls instanceof FlyControls) {
        ray.setFromCamera(new THREE.Vector3(0, 0, 0), camera);
        var collisionResults = ray.intersectObjects(scene.children, true);
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
        1.2, 0);
    rotate(cargoship, time * 2 / 3, .9, 0, 150,
        1, -50);
    rotate(yanBoat, -time / 30, 2, Math.PI, 0,
        12, -50);
    water.material.uniforms['time'].value += 1.0 / 60.0;
    renderStats()
    renderer.render(scene, camera);

}

init();
animate();