import Stats from "three/addons/libs/stats.module";


//** Global variables */
let stats;

export function initStats() {
    createStats();
    document.body.appendChild( stats.domElement );

    // call the render function
    renderStats();
}

//** Update  */
export function renderStats() {
    //requestAnimationFrame(renderStats);
    stats.update();
}

//** Create statistic panel and set its position*/
export function createStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
}