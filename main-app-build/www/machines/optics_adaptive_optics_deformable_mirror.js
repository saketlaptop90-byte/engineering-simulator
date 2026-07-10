import { materials } from '../utils/materials.js';

export function createAdaptiveOpticsDeformableMirror(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Support
    const baseGeo = new THREE.CylinderGeometry(3, 3, 1, 32);
    const base = new THREE.Mesh(baseGeo, materials.darkMetal);
    group.add(base);

    // Actuators
    const actuatorCount = 5;
    const actuators = [];
    const actuatorGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    for (let i = 0; i < actuatorCount; i++) {
        for (let j = 0; j < actuatorCount; j++) {
            const actuator = new THREE.Mesh(actuatorGeo, materials.metallic);
            actuator.position.set((i - 2) * 0.8, 1, (j - 2) * 0.8);
            actuator.name = `Actuator_${i}_${j}`;
            group.add(actuator);
            actuators.push(actuator);
        }
    }

    // Mirror Surface
    const mirrorGeo = new THREE.PlaneGeometry(5, 5, actuatorCount - 1, actuatorCount - 1);
    const mirror = new THREE.Mesh(mirrorGeo, materials.glass);
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = 1.75;
    group.add(mirror);

    // Animations: Actuators moving up and down
    const tracks = [];
    actuators.forEach((act) => {
        const offset = Math.random();
        const times = [0, 1, 2];
        const y1 = 1;
        const y2 = 1 + (Math.sin(offset * Math.PI) * 0.3);
        const y3 = 1;
        const values = [
            act.position.x, y1, act.position.z,
            act.position.x, y2, act.position.z,
            act.position.x, y3, act.position.z
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`${act.name}.position`, times, values));
    });

    // Beam reflecting off mirror
    const beamGeo = new THREE.CylinderGeometry(1.5, 1.5, 4);
    const beam = new THREE.Mesh(beamGeo, materials.laserLight || new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}));
    beam.position.y = 3.75;
    beam.name = 'LaserBeam';
    group.add(beam);
    
    tracks.push(new THREE.NumberKeyframeTrack('LaserBeam.material.opacity', [0, 1, 2], [0.3, 0.7, 0.3]));

    const clip = new THREE.AnimationClip('DeformableMirrorOperation', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
