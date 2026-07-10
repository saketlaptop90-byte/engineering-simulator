import { darkSteel, titanium, copper, gold } from '../utils/materials.js';

export function createEMPDisruptorCannon(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
    const body = new THREE.Mesh(bodyGeometry, darkSteel);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Copper Coils
    for (let i = 0; i < 5; i++) {
        const coilGeometry = new THREE.TorusGeometry(1.6, 0.1, 16, 100);
        const coil = new THREE.Mesh(coilGeometry, copper);
        coil.position.z = -2 + i;
        group.add(coil);
    }

    // Dish/Emitter
    const dishGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const dish = new THREE.Mesh(dishGeometry, titanium);
    dish.position.z = 3;
    group.add(dish);

    // EMP Pulse Ring
    const pulseGeometry = new THREE.TorusGeometry(1, 0.05, 16, 100);
    const pulseMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 3, transparent: true, opacity: 0 });
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.position.z = 4;
    pulse.name = 'PulseRing';
    group.add(pulse);

    // Animation: Pulse expanding
    const scaleTrack = new THREE.VectorKeyframeTrack('PulseRing.scale', [0, 0.5, 1], [1, 1, 1, 5, 5, 5, 1, 1, 1]);
    const opacityTrack = new THREE.NumberKeyframeTrack('PulseRing.material.opacity', [0, 0.1, 0.5, 1], [0, 1, 0, 0]);
    const pulseClip = new THREE.AnimationClip('EMPPulse', 1, [scaleTrack, opacityTrack]);
    animationClips.push(pulseClip);

    // Body recoil
    const recoilTrack = new THREE.VectorKeyframeTrack('.position', [0, 0.1, 1], [0, 0, 0, 0, 0, -1, 0, 0, 0]);
    const recoilClip = new THREE.AnimationClip('EMPRecoil', 1, [recoilTrack]);
    animationClips.push(recoilClip);

    return { group, animationClips };
}
