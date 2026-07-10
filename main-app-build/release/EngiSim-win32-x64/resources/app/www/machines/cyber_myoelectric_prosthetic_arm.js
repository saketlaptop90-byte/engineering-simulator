import { titanium, copper, darkSteel } from '../utils/materials.js';

export function createMyoelectricProstheticArm(THREE) {
    const group = new THREE.Group();

    const forearmGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 32);
    forearmGeometry.translate(0, 1, 0);
    const forearm = new THREE.Mesh(forearmGeometry, titanium);
    group.add(forearm);

    const handBaseGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.3);
    handBaseGeometry.translate(0, 2.3, 0);
    const handBase = new THREE.Mesh(handBaseGeometry, darkSteel);
    group.add(handBase);
    
    for(let i=0; i<3; i++) {
        const nodeGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.1, 32);
        const node = new THREE.Mesh(nodeGeo, copper);
        node.position.y = 0.5 + i * 0.5;
        group.add(node);
    }

    const fingersGroup = new THREE.Group();
    fingersGroup.position.y = 2.6;
    group.add(fingersGroup);

    const fingerTracks = [];
    const times = [0, 1, 2];

    for (let i = 0; i < 4; i++) {
        const finger = new THREE.Group();
        finger.position.x = -0.25 + i * 0.16;
        finger.name = `finger${i}`;
        const fGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        fGeometry.translate(0, 0.4, 0);
        const fMesh = new THREE.Mesh(fGeometry, titanium);
        finger.add(fMesh);
        fingersGroup.add(finger);

        const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const qBend = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 3, 0, 0));
        const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const vals = [
            qStart.x, qStart.y, qStart.z, qStart.w,
            qBend.x, qBend.y, qBend.z, qBend.w,
            qEnd.x, qEnd.y, qEnd.z, qEnd.w
        ];
        fingerTracks.push(new THREE.QuaternionKeyframeTrack(`finger${i}.quaternion`, times, vals));
    }
    
    const thumb = new THREE.Group();
    thumb.position.set(0.4, 2.4, 0);
    thumb.rotation.z = -Math.PI / 4;
    thumb.name = 'thumb';
    const thumbGeo = new THREE.BoxGeometry(0.12, 0.6, 0.12);
    thumbGeo.translate(0, 0.3, 0);
    const thumbMesh = new THREE.Mesh(thumbGeo, titanium);
    thumb.add(thumbMesh);
    group.add(thumb);
    
    const tStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 4));
    const tBend = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 3, -Math.PI / 4));
    const tEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 4));
    fingerTracks.push(new THREE.QuaternionKeyframeTrack('thumb.quaternion', times, [
        tStart.x, tStart.y, tStart.z, tStart.w,
        tBend.x, tBend.y, tBend.z, tBend.w,
        tEnd.x, tEnd.y, tEnd.z, tEnd.w
    ]));

    const clip = new THREE.AnimationClip('Grasp', 2, fingerTracks);

    return { group, animationClips: [clip] };
}
