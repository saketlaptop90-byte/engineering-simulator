import { materials } from '../utils/materials.js';

export function createCoaxialCableExtruder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const machineMat = (materials && materials.metal) || new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.6, roughness: 0.4 });
    const dangerMat = (materials && materials.warning) || new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const cableMat = (materials && materials.plastic) || new THREE.MeshStandardMaterial({ color: 0x111111 });

    // Main body
    const bodyGeo = new THREE.BoxGeometry(4, 2, 1.5);
    const body = new THREE.Mesh(bodyGeo, machineMat);
    body.position.y = 1;
    group.add(body);

    // Hopper
    const hopperGeo = new THREE.ConeGeometry(0.8, 1.5, 4);
    const hopper = new THREE.Mesh(hopperGeo, machineMat);
    hopper.rotation.y = Math.PI / 4;
    hopper.position.set(-1.5, 2.75, 0);
    group.add(hopper);

    // Spool (rotating)
    const spoolGroup = new THREE.Group();
    spoolGroup.position.set(2.5, 1, 0);
    spoolGroup.name = 'spoolGroup';
    group.add(spoolGroup);

    const spoolCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 16), dangerMat);
    spoolCenter.rotation.x = Math.PI / 2;
    spoolGroup.add(spoolCenter);

    const spoolEdge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32), machineMat);
    spoolEdge1.rotation.x = Math.PI / 2;
    spoolEdge1.position.z = 0.5;
    spoolGroup.add(spoolEdge1);

    const spoolEdge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32), machineMat);
    spoolEdge2.rotation.x = Math.PI / 2;
    spoolEdge2.position.z = -0.5;
    spoolGroup.add(spoolEdge2);

    // Cable line
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.rotation.z = Math.PI / 2;
    cable.position.set(0.5, 1, 0);
    group.add(cable);

    // Animation: Rotating spool
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI * 2));
    const qTimes = [0, 1, 2];
    const qValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const track = new THREE.QuaternionKeyframeTrack(`${spoolGroup.name}.quaternion`, qTimes, qValues);
    const clip = new THREE.AnimationClip('Extrude', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
