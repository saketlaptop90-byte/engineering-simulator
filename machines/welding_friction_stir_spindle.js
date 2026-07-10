import * as materials from '../utils/materials.js';

export function createFrictionStirSpindle(THREE) {
    const group = new THREE.Group();

    // Motor body
    const motorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    const motorMesh = new THREE.Mesh(motorGeo, materials.castIron || new THREE.MeshStandardMaterial({ color: 0x334455 }));
    motorMesh.position.y = 1.0;
    group.add(motorMesh);

    // Rotating assembly group
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'rotor';
    rotorGroup.position.y = 0.4;
    group.add(rotorGroup);

    // Tool holder
    const holderGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.4, 32);
    const holderMesh = new THREE.Mesh(holderGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x999999 }));
    rotorGroup.add(holderMesh);

    // FSW Tool Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, materials.toolSteel || new THREE.MeshStandardMaterial({ color: 0xbbbbbb }));
    shoulderMesh.position.y = -0.25;
    rotorGroup.add(shoulderMesh);

    // FSW Tool Pin
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.15, 16);
    const pinMesh = new THREE.Mesh(pinGeo, materials.toolSteel || new THREE.MeshStandardMaterial({ color: 0xbbbbbb }));
    pinMesh.position.y = -0.375;
    rotorGroup.add(pinMesh);

    // Animation: Rotation of the rotor, translation of the whole group
    const times = [0, 2, 4];
    const posTrack = new THREE.VectorKeyframeTrack('.position', times, [0, 0, 0,  2, 0, 0,  4, 0, 0]);
    
    // Rotation of rotor (high speed)
    const rotTimes = Array.from({length: 41}, (_, i) => i * 0.1);
    const rotValues = rotTimes.map(t => t * Math.PI * 10); // 5 revs per sec
    const rotTrack = new THREE.NumberKeyframeTrack(`rotor.rotation[y]`, rotTimes, rotValues);

    const clip = new THREE.AnimationClip('FrictionStir', 4, [posTrack, rotTrack]);

    return { group, animationClips: [clip] };
}
