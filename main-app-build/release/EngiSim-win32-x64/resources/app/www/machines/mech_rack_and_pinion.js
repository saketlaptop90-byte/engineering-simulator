import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createRackAndPinion(THREE) {
    const group = new THREE.Group();
    group.name = 'RackAndPinion';

    const pinionGroup = new THREE.Group();
    pinionGroup.name = 'pinionGroup';
    pinionGroup.position.set(0, 2, 0);
    group.add(pinionGroup);

    const pinionGeom = new THREE.CylinderGeometry(2, 2, 1, 16);
    const pinion = new THREE.Mesh(pinionGeom, brass);
    pinion.rotation.x = Math.PI / 2;
    pinionGroup.add(pinion);

    // Add teeth
    for (let i = 0; i < 16; i++) {
        const toothGeom = new THREE.BoxGeometry(0.5, 0.5, 1);
        const tooth = new THREE.Mesh(toothGeom, brass);
        const angle = (i / 16) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
        tooth.rotation.z = angle;
        pinionGroup.add(tooth);
    }

    const rackGroup = new THREE.Group();
    rackGroup.name = 'rackGroup';
    rackGroup.position.set(0, -0.25, 0);
    group.add(rackGroup);

    const rackGeom = new THREE.BoxGeometry(20, 1, 1);
    const rack = new THREE.Mesh(rackGeom, darkSteel);
    rackGroup.add(rack);

    // Add teeth to rack
    for (let i = -9; i <= 9; i++) {
        const toothGeom = new THREE.BoxGeometry(0.5, 0.5, 1);
        const tooth = new THREE.Mesh(toothGeom, darkSteel);
        tooth.position.set(i, 0.75, 0);
        rackGroup.add(tooth);
    }

    const duration = 4;
    const times = [0, 2, 4];

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    
    const pinionTrack = new THREE.QuaternionKeyframeTrack(
        'pinionGroup.quaternion',
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const rackTrack = new THREE.VectorKeyframeTrack(
        'rackGroup.position',
        times,
        [0, -0.25, 0,  -Math.PI * 2, -0.25, 0,  0, -0.25, 0]
    );

    const clip = new THREE.AnimationClip('RackAndPinionAction', duration, [pinionTrack, rackTrack]);

    return { group, animationClips: [clip] };
}
