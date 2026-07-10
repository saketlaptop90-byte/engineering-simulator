import { concrete, darkSteel, glass, glowing } from '../utils/materials.js';

export function createReprocessingCentrifuge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const casingGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const casing = new THREE.Mesh(casingGeo, glass);
    casing.position.y = 4;
    group.add(casing);

    const rotorGeo = new THREE.CylinderGeometry(1, 1, 7.5, 32);
    const rotor = new THREE.Mesh(rotorGeo, darkSteel);
    rotor.position.y = 4;
    group.add(rotor);

    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const base = new THREE.Mesh(baseGeo, concrete);
    group.add(base);

    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const rotValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack(rotor.uuid + '.quaternion', times, rotValues);
    const spinClip = new THREE.AnimationClip('Spin', 2, [spinTrack]);
    animationClips.push(spinClip);

    return { group, animationClips };
}
