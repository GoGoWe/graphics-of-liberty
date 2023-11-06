import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export function initControls(camera,renderer){


//set controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,40,0);
    controls.listenToKeyEvents(window);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle=Math.PI/2;
    //controls.zoomSpeed=0;
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

    return controls;
}