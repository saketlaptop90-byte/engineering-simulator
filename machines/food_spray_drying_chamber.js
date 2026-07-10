import { materials } from '../utils/materials.js';

export function createSprayDryingChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const chamber = new THREE.Mesh(chamberGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    chamber.position.y = 4;
    group.add(chamber);

    // Bottom cone
    const coneGeo = new THREE.ConeGeometry(2, 2, 32);
    const cone = new THREE.Mesh(coneGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    cone.position.y = 1;
    cone.rotation.x = Math.PI;
    group.add(cone);

    // Spray nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.1, 0.5, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    nozzle.position.y = 5.8;
    group.add(nozzle);

    // Particle system for spray simulation
    const particleGroup = new THREE.Group();
    particleGroup.name = "sprayParticles";
    particleGroup.position.y = 5.5;
    group.add(particleGroup);

    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);

    for (let i = 0; i < 20; i++) {
        const particle = new THREE.Mesh(particleGeo, particleMaterial);
        particle.position.set((Math.random() - 0.5) * 0.5, -Math.random() * 4, (Math.random() - 0.5) * 0.5);
        particle.name = `particle${i}`;
        particleGroup.add(particle);
    }

    // Animation tracks for particles falling and spreading
    const tracks = [];
    for (let i = 0; i < 20; i++) {
        const pName = `particle${i}`;
        const startY = 0;
        const endY = -4 - Math.random();
        const startX = 0;
        const endX = (Math.random() - 0.5) * 3;
        const startZ = 0;
        const endZ = (Math.random() - 0.5) * 3;

        tracks.push(new THREE.VectorKeyframeTrack(
            `sprayParticles/${pName}.position`,
            [0, 1 + Math.random()],
            [startX, startY, startZ, endX, endY, endZ]
        ));
    }

    const clip = new THREE.AnimationClip('Spray', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
