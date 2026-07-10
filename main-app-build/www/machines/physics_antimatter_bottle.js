import { glass, gold, darkSteel } from '../utils/materials.js';

export function createAntimatterBottle(THREE) {
    const group = new THREE.Group();
    
    function generateId() { return Math.random().toString(36).substr(2, 9); }
    
    // Core containment vessel
    const vesselGeometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    const vessel = new THREE.Mesh(vesselGeometry, glass);
    group.add(vessel);
    
    // Magnetic containment rings
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.4, 16, 64);
    const rings = [];
    for (let i = -3; i <= 3; i += 2) {
        const ring = new THREE.Mesh(ringGeometry, darkSteel);
        ring.position.y = i;
        ring.rotation.x = Math.PI / 2;
        ring.name = "ring_" + i + "_" + generateId();
        group.add(ring);
        rings.push(ring);
    }
    
    // Antimatter particle
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particle = new THREE.Mesh(particleGeometry, gold);
    particle.name = "antimatter_particle_" + generateId();
    group.add(particle);

    const animationClips = [];
    const times = [0, 0.5, 1, 1.5, 2];
    
    const particlePositions = [
        0, 0, 0,
        0.2, 0.1, -0.2,
        0, 0, 0,
        -0.2, -0.1, 0.2,
        0, 0, 0
    ];
    const particleTrack = new THREE.VectorKeyframeTrack(`${particle.name}.position`, times, particlePositions);
    
    const ringScales = [
        1, 1, 1,
        1.1, 1.1, 1.1,
        1, 1, 1,
        1.05, 1.05, 1.05,
        1, 1, 1
    ];
    const ringTracks = rings.map(ring => new THREE.VectorKeyframeTrack(`${ring.name}.scale`, times, ringScales));

    const clip = new THREE.AnimationClip('ContainmentPulse', 2, [particleTrack, ...ringTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
