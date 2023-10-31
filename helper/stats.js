import Stats from "three/addons/libs/stats.module";


// global variables
let thisrenderer;
let thisscene;
let thiscamera;
let stats;

export function initStats(renderer, scene, camera) {
    thisrenderer=renderer;
    thisscene=scene;
    thiscamera=camera;
    stats = createStats();
    document.body.appendChild( stats.domElement );

    // call the render function
    renderStats();
}


export function renderStats() {
    //requestAnimationFrame(renderStats);
    stats.update();
}//*/
export function createStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
}