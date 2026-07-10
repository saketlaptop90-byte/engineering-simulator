import * as materials from '../utils/materials.js';

export function createCTDRosette(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main frame
    const frameGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2, 12, 1, true);
    // Use an existing material, clone and wireframe it if possible
    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    group.add(frame);

    // Bottles
    const bottleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const numBottles = 12;
    for(let i=0; i<numBottles; i++) {
        const angle = (i / numBottles) * Math.PI * 2;
        const bottle = new THREE.Mesh(bottleGeometry, materials.accent);
        bottle.position.x = Math.cos(angle) * 0.9;
        bottle.position.z = Math.sin(angle) * 0.9;
        group.add(bottle);
    }

    // CTD Sensors at bottom
    const sensorGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const sensor = new THREE.Mesh(sensorGeometry, materials.composite);
    sensor.position.y = -1;
    group.add(sensor);

    // Cable attachment
    const cableGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const cable = new THREE.Mesh(cableGeometry, materials.rubber);
    cable.position.y = 2.5;
    group.add(cable);

    // Descent/Ascent animation
    const times = [0, 5, 10];
    const valuesPos = [
        0, 0, 0,
        0, -10, 0,
        0, 0, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack(`${group.uuid}.position`, times, valuesPos);
    
    // Slow rotation
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
    
    const rotValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ];
    const rotTrack = new THREE.QuaternionKeyframeTrack(`${group.uuid}.quaternion`, times, rotValues);

    const clip = new THREE.AnimationClip('CTDOperation', 10, [posTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
