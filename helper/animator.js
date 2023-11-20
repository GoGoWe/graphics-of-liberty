import * as THREE from "three";

/**
 * Initiate a rotate animation for the given object on a giver radius 
 * @param {THREE.Object3D} obj - The 3D object in the scene that should be rotated 
 * @param {int} ticker - The render ticker to update the animation each frame
 * @param {int} radius - The radius the object should be rotated on
 * @param {int} startPosition - The start position of the object
 * @param {float} startX - The x position of the object
 * @param {float} startY - The y position of the object
 * @param {float} startZ - The z position of the object
 * @returns 
 */
export function rotate(obj, ticker, radius, startPosition, startX, startY, startZ){
    if (obj === null) return;
    obj.rotation.y = ticker/1000+startPosition;
    obj.position.y = startY;
    obj.position.x = startX+Math.sin(ticker/1000+startPosition)*radius*25;
    obj.position.z = startZ+Math.sin(ticker/1000+Math.PI/2+startPosition)*radius*20
}

/**
 * Adds a confetti to a object groups and animates them
 * @param {THREE.Vector3} position - The position where the confetti should spawn and fall
 * @param {THREE.Group} objectGroup - The group where the confetti should be added to
 * @returns 
 */
export function createConfetti(position,objectGroup) {
    let particleGeometry = new THREE.BufferGeometry();
    let particleCount = 100;
    let colors = new Float32Array(particleCount * 3);
    let positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        let theta = Math.random() * Math.PI * 2;
        let phi = Math.random() * Math.PI;
        let radius = Math.random() * 2;

        positions[i] = radius * Math.sin(phi) * Math.cos(theta) + position.x;
        positions[i + 1] = radius * Math.cos(phi) + position.y;
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta) + position.z;

        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    let particleMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true
    });

    let particles = new THREE.Points(particleGeometry, particleMaterial);
    objectGroup.add(particles);

    return particles;
}

/**
 * A particle animation, moving each particle of a group randomly downwards
 * @param {*} confettiParticles 
 */
export function animateParticles(confettiParticles){
    for (let i = 0; i < confettiParticles.length; i++) {
        let particles = confettiParticles[i];
        let positions = particles.geometry.attributes.position.array;

        for (let j = 0; j < positions.length; j += 3) {
            positions[j] += (Math.random() - 0.5) * 0.5;
            positions[j + 1] += (Math.random() - 0.9) * 0.2;
            positions[j + 2] += (Math.random() - 0.5) * 0.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
}