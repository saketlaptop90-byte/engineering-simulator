import * as materials from '../utils/materials.js';

export function createRowingMachineErgometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, materials.castIron);
    group.add(base);

    // Main body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const body = new THREE.Mesh(bodyGeo, materials.steel);
    body.position.y = 1.5;
    group.add(body);

    // Rotating part
    const rotorGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);
    rotorGeo.rotateZ(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorGeo, materials.brass);
    rotor.position.y = 1.5;
    rotor.name = "Rotor_createRowingMachineErgometer";
    group.add(rotor);

    // Animation
    const times = [0, 1, 2];
    const xAxis = new THREE.Vector3(1, 0, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2);

    const track = new THREE.QuaternionKeyframeTrack(
        "Rotor_createRowingMachineErgometer.quaternion",
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const clip = new THREE.AnimationClip('Operate_createRowingMachineErgometer', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}

