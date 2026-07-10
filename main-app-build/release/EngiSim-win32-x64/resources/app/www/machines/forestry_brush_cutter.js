import { materials } from '../utils/materials.js';

export function createBrushCutter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const frameGeo = new THREE.BoxGeometry(2, 0.5, 1);
    const frame = new THREE.Mesh(frameGeo, materials.paintedMetal);
    frame.position.y = 0.5;
    group.add(frame);

    // Rotor
    const rotorGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 16);
    const rotor = new THREE.Mesh(rotorGeo, materials.steel);
    rotor.rotation.z = Math.PI / 2;
    rotor.position.set(0, -0.2, 0.5);
    frame.add(rotor);

    // Flails
    for (let i = 0; i < 20; i++) {
        const flailGeo = new THREE.BoxGeometry(0.05, 0.3, 0.1);
        const flail = new THREE.Mesh(flailGeo, materials.carbide);
        const angle = (i / 5) * Math.PI * 2;
        flail.position.set(-0.8 + (i * 0.08), Math.sin(angle) * 0.3, Math.cos(angle) * 0.3);
        rotor.add(flail);
    }

    // Animation
    const rotorTrack = new THREE.NumberKeyframeTrack(
        `${rotor.uuid}.rotation[x]`,
        [0, 1],
        [0, Math.PI * 4]
    );

    const clip = new THREE.AnimationClip('Cut', 1, [rotorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
