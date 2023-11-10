import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import { FlyControls } from 'three/addons/controls/FlyControls.js';

export function initControls(camera,renderer){
    let controls;
    function initFlyControls(camera,renderer) {
        controls = new FlyControls(camera, renderer.domElement);

        controls.movementSpeed = 50;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 12;
        controls.autoForward = false;
        controls.dragToLook = true;
        return controls;
    }
//set controls

   let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
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
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                resetArrowButtons();
                upButton.classList.add('active');
                break;
            case 'ArrowDown':
                resetArrowButtons();
                downButton.classList.add('active');
                break;
            case 'ArrowRight':
                resetArrowButtons();
                rightButton.classList.add('active');
                break;
            case 'ArrowLeft':
                resetArrowButtons();
                leftButton.classList.add('active');
                break;
        }
    });

    return initFlyControls(camera,renderer);
}