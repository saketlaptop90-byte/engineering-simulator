import { steel, copper, darkSteel, glass } from '../utils/materials.js';

export function createSalinityGradientGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main housing
    const housingGeom = new THREE.BoxGeometry(10, 4, 6);
    const housing = new THREE.Mesh(housingGeom, darkSteel);
    housing.position.y = 2;
    group.add(housing);

    // Fresh water tank (left)
    const freshTankGeom = new THREE.BoxGeometry(3, 3, 5);
    const freshTank = new THREE.Mesh(freshTankGeom, glass);
    freshTank.position.set(-3, 2, 0);
    group.add(freshTank);

    // Salt water tank (right)
    const saltTankGeom = new THREE.BoxGeometry(3, 3, 5);
    const saltTank = new THREE.Mesh(saltTankGeom, glass);
    saltTank.position.set(3, 2, 0);
    group.add(saltTank);

    // Membrane in the middle
    const membraneGeom = new THREE.BoxGeometry(0.2, 3.5, 5.5);
    const membrane = new THREE.Mesh(membraneGeom, copper);
    membrane.position.set(0, 2, 0);
    group.add(membrane);

    // Ion flow indicator particles
    const particleGroup = new THREE.Group();
    particleGroup.name = "particleGroup";
    particleGroup.position.set(0, 2, 0);
    group.add(particleGroup);

    for (let i = 0; i < 5; i++) {
        const particle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), steel);
        particle.position.set(-1.5 + Math.random() * 0.5, -1 + i * 0.5, -2 + Math.random() * 4);
        particleGroup.add(particle);
    }

    // Animation (Particles moving through membrane)
    const times = [0, 2, 4];
    const posValues = [
        0, 2, 0,
        1.5, 2, 0,
        0, 2, 0
    ];

    const flowTrack = new THREE.VectorKeyframeTrack(`${particleGroup.name}.position`, times, posValues);
    const clip = new THREE.AnimationClip('IonFlow', 4, [flowTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
