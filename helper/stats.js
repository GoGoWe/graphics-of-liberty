import Stats from "three/addons/libs/stats.module";

// Global variables 
let stats;

export function initStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    document.body.appendChild(stats.domElement);

    // call the render function
    renderStats();
}

//** Update to show current information */
export function renderStats() {
    stats.update();
}