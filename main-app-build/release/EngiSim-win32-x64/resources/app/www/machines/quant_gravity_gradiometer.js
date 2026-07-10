import { copper, gold, glass } from '../utils/materials.js';

export function createGravityGradiometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Housing
    const bodyGeometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    const body = new THREE.Mesh(bodyGeometry, copper);
    group.add(body);

    // Atom Trap 1 (Top)
    const trap1Geo = new THREE.SphereGeometry(0.8, 32, 32);
    const trap1 = new THREE.Mesh(trap1Geo, glass);
    trap1.position.y = 3;
    group.add(trap1);

    // Atom Trap 2 (Bottom)
    const trap2 = new THREE.Mesh(trap1Geo, glass);
    trap2.position.y = -3;
    group.add(trap2);

    // Lasers (Visualized as thin cylinders)
    const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    group.add(laser);

    // Animation: Pulses in the lasers and rotating the atom traps
    const trapTrack1 = new THREE.VectorKeyframeTrack(
        '.children[1].rotation[y]',
        [0, 2],
        [0, Math.PI * 2]
    );
    const trapTrack2 = new THREE.VectorKeyframeTrack(
        '.children[2].rotation[y]',
        [0, 2],
        [0, -Math.PI * 2]
    );
    const laserOpacityTrack = new THREE.NumberKeyframeTrack(
        '.children[3].material.opacity',
        [0, 0.5, 1, 1.5, 2],
        [0.2, 1, 0.2, 1, 0.2]
    );

    const clip = new THREE.AnimationClip('Operate', 2, [trapTrack1, trapTrack2, laserOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
