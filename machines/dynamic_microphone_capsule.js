import { materials } from '../utils/materials.js';

export function createDynamicMicrophone(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magnet structure
    const magnetGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const magnetMesh = new THREE.Mesh(magnetGeo, materials.magnetic);
    magnetMesh.position.y = 0.75;
    group.add(magnetMesh);

    // Core
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32);
    const coreMesh = new THREE.Mesh(coreGeo, materials.iron);
    coreMesh.position.y = 0.8;
    group.add(coreMesh);

    // Voice coil
    const coilGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32, 1, true);
    const coilMesh = new THREE.Mesh(coilGeo, materials.copperWire);
    coilMesh.position.y = 1.6;
    coilMesh.name = "voiceCoil";
    group.add(coilMesh);

    // Diaphragm
    const diaphragmGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, materials.plastic);
    diaphragmMesh.position.y = 1.3;
    diaphragmMesh.name = "diaphragm";
    group.add(diaphragmMesh);

    // Animation: Vibration of diaphragm and voice coil
    const times = [];
    const coilValues = [];
    const diaphragmValues = [];
    
    for (let i = 0; i <= 60; i++) {
        const t = i / 30; // 2 seconds
        times.push(t);
        const offset = Math.sin(t * Math.PI * 20) * 0.05 * Math.exp(-t); // Damped oscillation
        
        coilValues.push(1.6 + offset);
        diaphragmValues.push(1.3 + offset);
    }

    const coilTrack = new THREE.NumberKeyframeTrack('voiceCoil.position[y]', times, coilValues);
    const diaphragmTrack = new THREE.NumberKeyframeTrack('diaphragm.position[y]', times, diaphragmValues);

    const clip = new THREE.AnimationClip('Vibrate', 2, [coilTrack, diaphragmTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
