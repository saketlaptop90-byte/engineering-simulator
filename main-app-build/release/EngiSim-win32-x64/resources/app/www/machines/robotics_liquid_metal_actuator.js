import { copper, darkSteel } from '../utils/materials.js';

export function createLiquidMetalActuator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Liquid Metal Material
    const liquidMetalMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 2.0
    });

    const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.5
    });

    // Housing
    const housingGeo = new THREE.BoxGeometry(2, 0.5, 1);
    const housingMesh = new THREE.Mesh(housingGeo, housingMaterial);
    group.add(housingMesh);
    
    // Electrodes
    const elGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6);
    const el1 = new THREE.Mesh(elGeo, copper);
    el1.position.set(-0.8, 0, 0);
    el1.rotation.x = Math.PI / 2;
    group.add(el1);
    
    const el2 = new THREE.Mesh(elGeo, copper);
    el2.position.set(0.8, 0, 0);
    el2.rotation.x = Math.PI / 2;
    group.add(el2);

    // Liquid Metal Droplet
    const dropletGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const droplet = new THREE.Mesh(dropletGeo, liquidMetalMaterial);
    droplet.position.set(0, 0.25, 0);
    group.add(droplet);

    // Animation (Morphing/Moving droplet)
    const times = [0, 1, 2, 3, 4];
    const posValues = [
        0, 0.25, 0,
        -0.5, 0.25, 0,
        0, 0.25, 0,
        0.5, 0.25, 0,
        0, 0.25, 0
    ];
    
    const scaleValues = [
        1, 1, 1,
        1.5, 0.8, 1,
        1, 1, 1,
        1.5, 0.8, 1,
        1, 1, 1
    ];

    const posTrack = new THREE.VectorKeyframeTrack(`${droplet.uuid}.position`, times, posValues);
    const scaleTrack = new THREE.VectorKeyframeTrack(`${droplet.uuid}.scale`, times, scaleValues);

    const clip = new THREE.AnimationClip('LiquidActuation', 4, [posTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
