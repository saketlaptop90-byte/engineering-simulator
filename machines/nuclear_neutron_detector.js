import { materials } from '../utils/materials.js';

export function createNeutronDetector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base tube
    const tubeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const tube = new THREE.Mesh(tubeGeometry, materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 }));
    group.add(tube);

    // Inner wire (anode)
    const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4.2, 8);
    const wire = new THREE.Mesh(wireGeometry, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.1 }));
    group.add(wire);

    // Particle representation for animation
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(0, -2, 0);
    particle.name = "neutronParticle";
    group.add(particle);

    // Animation: Particle moving up the tube and flashing
    const times = [0, 1, 2];
    const positions = [0, -2, 0, 0, 2, 0, 0, -2, 0];
    const posTrackName = particle.name + '.position';
    const namedPosTrack = new THREE.VectorKeyframeTrack(posTrackName, times, positions);

    const scaleTimes = [0, 0.5, 1, 1.5, 2];
    const scales = [1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1];
    const scaleTrackName = particle.name + '.scale';
    const namedScaleTrack = new THREE.VectorKeyframeTrack(scaleTrackName, scaleTimes, scales);

    const finalClip = new THREE.AnimationClip('NeutronDetection', 2, [namedPosTrack, namedScaleTrack]);
    animationClips.push(finalClip);

    return { group, animationClips };
}
