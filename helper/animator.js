import * as THREE from "three";

export function rotate(obj, renderZaehler, radius, startausrichtung, startX,startY, startZ){
    if(obj===null)return;
    obj.rotation.y = renderZaehler/1000+startausrichtung;
    obj.position.y=startY;
    obj.position.x = startX+Math.sin(renderZaehler/1000+startausrichtung)*radius*25;
    obj.position.z = startZ+Math.sin(renderZaehler/1000+Math.PI/2+startausrichtung)*radius*20
}

export function createConfetti(position,confetti) {
    let particleGeometry = new THREE.BufferGeometry();
    let colors = new Float32Array(100 * 3);
    let particleCount = 100;
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
    confetti.add(particles);

    return particles;
}



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