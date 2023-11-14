import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import { FlyControls } from 'three/addons/controls/FlyControls.js';

export function initControls(camera,renderer, controls){
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
    });

    downButton.addEventListener('click', () => {
        resetArrowButtons();
        downButton.classList.add('active');
        // Trigger your button event here
    });

    rightButton.addEventListener('click', () => {
        resetArrowButtons();
        rightButton.classList.add('active');
        // Trigger your button event here
    });

    leftButton.addEventListener('click', () => {
        resetArrowButtons();
        leftButton.classList.add('active');
        // Trigger your button event here
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

    document.addEventListener('keyup', (event) => {resetArrowButtons();});


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

    return initFlyControls(camera,renderer);
}