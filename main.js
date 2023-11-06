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


    camera=initCamera(innerWidth, innerHeight);

    water=initEnvironment(scene,renderer,camera);


    controls=initControls(camera,renderer);



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




var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
function simulateKeyboardEvent(key) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            keyCode: 38, // Key code for 'ArrowUp'
            which: 38,   // The 'which' property should match the keyCode
        });
        window.dispatchEvent(event);//darauf sollten die controls reagieren, tun es aber nicht :( #todo
        controls.update();
}

// Get references to the arrow buttons and the action button
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const rightButton = document.getElementById('right');
const leftButton = document.getElementById('left');

// Add event listeners to the arrow buttons
upButton.addEventListener('click', () => {
    resetArrowButtons();
    upButton.classList.add('active');
    // Trigger your button event here
    simulateKeyboardEvent('ArrowUp');
});

downButton.addEventListener('click', () => {
    resetArrowButtons();
    downButton.classList.add('active');
    // Trigger your button event here
    simulateKeyboardEvent('ArrowDown');
});

rightButton.addEventListener('click', () => {
    resetArrowButtons();
    rightButton.classList.add('active');
    // Trigger your button event here
    simulateKeyboardEvent('ArrowRight');
});

leftButton.addEventListener('click', () => {
    resetArrowButtons();
    leftButton.classList.add('active');
    // Trigger your button event here
    simulateKeyboardEvent('ArrowLeft');
});


// Function to reset the arrow buttons to their default state
function resetArrowButtons() {
    upButton.classList.remove('active');
    downButton.classList.remove('active');
    rightButton.classList.remove('active');
    leftButton.classList.remove('active');
}
// Add keyboard event listeners
function triggerButtonEvent() {
    // Handle your button event here
}
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            resetArrowButtons();
            upButton.classList.add('active');
            triggerButtonEvent();
            break;
        case 'ArrowDown':
            resetArrowButtons();
            downButton.classList.add('active');
            triggerButtonEvent();
            break;
        case 'ArrowRight':
            resetArrowButtons();
            rightButton.classList.add('active');
            triggerButtonEvent();
            break;
        case 'ArrowLeft':
            resetArrowButtons();
            leftButton.classList.add('active');
            triggerButtonEvent();
            break;
    }
});

let renderZaehler=0;
function render() {
    renderZaehler+=1;
    const time = performance.now()/10;
    rotate(sailboat, -time*0.2,.1,Math.PI);
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