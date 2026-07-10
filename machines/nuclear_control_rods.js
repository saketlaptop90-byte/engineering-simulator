import { materials } from '../utils/materials.js';

export function createControlRods(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const rodMat = materials?.absorber || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
    const coreMat = materials?.fuel || new THREE.MeshStandardMaterial({ color: 0x112255, metalness: 0.5, roughness: 0.8 });
    const waterMat = materials?.waterGlow || new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.3 });

    // Reactor Core block
    const core = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 32), coreMat);
    group.add(core);

    // Coolant (Cherenkov radiation glow)
    const coolant = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 4.5, 32), waterMat);
    group.add(coolant);

    // Control rods
    const rodsGroup = new THREE.Group();
    rodsGroup.name = "controlRods";
    const positions = [
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    positions.forEach((pos) => {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4, 16), rodMat);
        rod.position.set(pos[0], 2, pos[1]);
        rodsGroup.add(rod);
    });

    group.add(rodsGroup);

    // Animation: rods inserting and withdrawing
    const times = [0, 2, 4, 6];
    const values = [
        0, 2, 0, // Out
        0, -1, 0, // In
        0, -1, 0, // Hold In
        0, 2, 0  // Out
    ];
    
    const positionTrack = new THREE.VectorKeyframeTrack(`${rodsGroup.name}.position`, times, values);
    const clip = new THREE.AnimationClip('RodMovement', 6, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
