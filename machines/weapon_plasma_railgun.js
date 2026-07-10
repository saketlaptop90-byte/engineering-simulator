import { darkSteel, titanium, copper, gold } from '../utils/materials.js';

export function createPlasmaRailgun(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.BoxGeometry(4, 1, 8);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    group.add(base);

    // Rails
    const railGeometry = new THREE.BoxGeometry(0.5, 1, 10);
    const leftRail = new THREE.Mesh(railGeometry, copper);
    leftRail.position.set(-1, 1, 1);
    leftRail.name = 'LeftRail';
    group.add(leftRail);

    const rightRail = new THREE.Mesh(railGeometry, copper);
    rightRail.position.set(1, 1, 1);
    rightRail.name = 'RightRail';
    group.add(rightRail);

    // Plasma Core
    const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.set(0, 1, -2);
    core.name = 'PlasmaCore';
    group.add(core);

    // Animation: Rails charging (moving apart and together, or glowing)
    // Animation: Core pulsing
    const scaleKF = new THREE.VectorKeyframeTrack('PlasmaCore.scale', [0, 1, 2], [1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1]);
    const coreClip = new THREE.AnimationClip('PlasmaCorePulse', 2, [scaleKF]);
    animationClips.push(coreClip);

    // Recoil animation for base
    const recoilKF = new THREE.VectorKeyframeTrack('.position', [0, 0.2, 1], [0, 0, 0, 0, 0, 2, 0, 0, 0]);
    const recoilClip = new THREE.AnimationClip('RailgunRecoil', 1, [recoilKF]);
    animationClips.push(recoilClip);

    return { group, animationClips };
}
