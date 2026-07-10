import { aluminum, copper, steel, plastic, whitePlastic, darkSteel } from '../utils/materials.js';

export function createAirConditioner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const indoorGroup = new THREE.Group();
    indoorGroup.name = "IndoorUnit";
    indoorGroup.position.set(0, 2, 0);
    
    const indoorChassis = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.8), whitePlastic);
    indoorGroup.add(indoorChassis);

    const louver = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 0.2), whitePlastic);
    louver.name = "Louver";
    louver.position.set(0, -0.5, 0.3);
    indoorGroup.add(louver);

    const indoorFan = new THREE.Group();
    indoorFan.name = "IndoorFan";
    const indoorFanMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.6, 16), darkSteel);
    indoorFanMesh.rotation.z = Math.PI / 2;
    indoorFan.add(indoorFanMesh);
    indoorFan.position.set(0, -0.2, 0.1);
    indoorGroup.add(indoorFan);

    group.add(indoorGroup);

    const outdoorGroup = new THREE.Group();
    outdoorGroup.name = "OutdoorUnit";
    outdoorGroup.position.set(2, -2, 2);

    const outdoorChassis = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 1.2), steel);
    outdoorGroup.add(outdoorChassis);

    const outdoorFan = new THREE.Group();
    outdoorFan.name = "OutdoorFan";
    outdoorFan.position.set(-0.4, 0, 0.6);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), plastic);
    hub.rotation.x = Math.PI / 2;
    outdoorFan.add(hub);
    for(let i=0; i<3; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.05), plastic);
        blade.position.y = 0.7;
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI * 2) / 3;
        pivot.add(blade);
        outdoorFan.add(pivot);
    }
    outdoorGroup.add(outdoorFan);

    const compressor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), darkSteel);
    compressor.position.set(1, -0.6, 0);
    outdoorGroup.add(compressor);

    group.add(outdoorGroup);

    // Animations
    const times = [0, 0.5, 1.0];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const indoorFanTrack = new THREE.QuaternionKeyframeTrack(
        'IndoorFan.quaternion', times, [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );

    const qOut1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const qOut2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const qOut3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const outdoorFanTrack = new THREE.QuaternionKeyframeTrack(
        'OutdoorFan.quaternion', times, [...qOut1.toArray(), ...qOut2.toArray(), ...qOut3.toArray()]
    );

    const clip = new THREE.AnimationClip('ac_operation', 1, [indoorFanTrack, outdoorFanTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
