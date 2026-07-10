import * as materials from '../utils/materials.js';

export function createSonarArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main vessel body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const body = new THREE.Mesh(bodyGeometry, materials.metal);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Cable
    const cableGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const cable = new THREE.Mesh(cableGeometry, materials.rubber);
    cable.position.x = -4.5;
    cable.rotation.z = Math.PI / 2;
    group.add(cable);

    // Sonar Node 1
    const node1Geometry = new THREE.SphereGeometry(0.6, 16, 16);
    const node1 = new THREE.Mesh(node1Geometry, materials.accent);
    node1.position.x = -7;
    group.add(node1);

    // Sonar Node 2
    const node2Geometry = new THREE.SphereGeometry(0.6, 16, 16);
    const node2 = new THREE.Mesh(node2Geometry, materials.accent);
    node2.position.x = -10;
    group.add(node2);

    // Sonar Waves Pulsing Animation
    const waveGeometry = new THREE.RingGeometry(0.8, 1.0, 32);
    // Since we don't have waveMaterial from materials, we define a simple one
    const waveMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    
    const wave1 = new THREE.Mesh(waveGeometry, waveMaterial);
    wave1.position.x = -7;
    wave1.rotation.y = Math.PI / 2;
    group.add(wave1);

    const wave2 = new THREE.Mesh(waveGeometry, waveMaterial.clone());
    wave2.position.x = -10;
    wave2.rotation.y = Math.PI / 2;
    group.add(wave2);

    // Animation for waves pulsing
    const times = [0, 1, 2];
    const valuesScale = [1, 1, 1, 3, 3, 3, 1, 1, 1];

    const scaleTrack1 = new THREE.VectorKeyframeTrack(`${wave1.uuid}.scale`, times, valuesScale);
    const scaleTrack2 = new THREE.VectorKeyframeTrack(`${wave2.uuid}.scale`, times, valuesScale);
    
    const clip = new THREE.AnimationClip('SonarPulse', 2, [scaleTrack1, scaleTrack2]);
    animationClips.push(clip);

    return { group, animationClips };
}
