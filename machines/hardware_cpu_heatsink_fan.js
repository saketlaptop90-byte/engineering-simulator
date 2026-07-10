import { materials } from '../utils/materials.js';

export function createCpuHeatsinkFan(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base plate
    const baseGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const baseMesh = new THREE.Mesh(baseGeo, materials.copper || materials.metallic);
    baseMesh.position.y = 0.1;
    group.add(baseMesh);

    // Heat pipes
    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.5, 8);
    for (let i = 0; i < 4; i++) {
        const pipe = new THREE.Mesh(pipeGeo, materials.copper || materials.metallic);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, 0.3, -1.5 + i * 1);
        group.add(pipe);
    }

    // Fins
    const finGeo = new THREE.BoxGeometry(4, 3, 0.05);
    const finsGroup = new THREE.Group();
    for (let i = 0; i < 30; i++) {
        const fin = new THREE.Mesh(finGeo, materials.metallic);
        fin.position.set(0, 1.8, -1.8 + i * 0.12);
        finsGroup.add(fin);
    }
    group.add(finsGroup);

    // Fan Assembly
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 3.5, 0);
    group.add(fanGroup);

    // Fan casing
    const casingGeo = new THREE.TorusGeometry(2, 0.2, 16, 32);
    const casingMesh = new THREE.Mesh(casingGeo, materials.plastic || materials.metallic);
    casingMesh.rotation.x = Math.PI / 2;
    fanGroup.add(casingMesh);

    // Rotor
    const rotorGroup = new THREE.Group();
    rotorGroup.name = "CPU_FanRotor";
    fanGroup.add(rotorGroup);

    const centerGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const centerMesh = new THREE.Mesh(centerGeo, materials.plastic || materials.metallic);
    rotorGroup.add(centerMesh);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(1.5, 0.05, 0.5);
    for (let i = 0; i < 7; i++) {
        const blade = new THREE.Mesh(bladeGeo, materials.plastic || materials.metallic);
        const angle = (i / 7) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 1, 0, Math.sin(angle) * 1);
        blade.rotation.y = -angle;
        blade.rotation.x = 0.5; // pitch
        rotorGroup.add(blade);
    }

    // Animation
    const spinTimes = [0, 0.25, 0.5, 0.75, 1];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    const spinValues = [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack('CPU_FanRotor.quaternion', spinTimes, spinValues);
    const spinClip = new THREE.AnimationClip('Spin', 1, [spinTrack]);
    animationClips.push(spinClip);

    return { group, animationClips };
}
