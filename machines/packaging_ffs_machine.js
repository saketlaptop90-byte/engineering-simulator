import { materials } from '../utils/materials.js';

export function createFFSMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyGeom = new THREE.BoxGeometry(1.5, 3, 1.5);
    const body = new THREE.Mesh(bodyGeom, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    body.position.set(0, 1.5, 0);
    group.add(body);

    const hopperGeom = new THREE.ConeGeometry(1, 1, 4);
    const hopper = new THREE.Mesh(hopperGeom, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    hopper.position.set(0, 3.5, 0);
    hopper.rotation.y = Math.PI / 4;
    hopper.rotation.x = Math.PI;
    group.add(hopper);

    const tubeGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
    const tube = new THREE.Mesh(tubeGeom, materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 }));
    tube.position.set(0, 1.5, 1);
    group.add(tube);

    const jawGeom = new THREE.BoxGeometry(1, 0.2, 0.2);
    
    const leftJaw = new THREE.Mesh(jawGeom, materials.warning || new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    leftJaw.position.set(-0.6, 1, 1);
    leftJaw.name = 'leftJaw';
    group.add(leftJaw);

    const rightJaw = new THREE.Mesh(jawGeom, materials.warning || new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    rightJaw.position.set(0.6, 1, 1);
    rightJaw.name = 'rightJaw';
    group.add(rightJaw);

    const leftTrack = new THREE.VectorKeyframeTrack(
        'leftJaw.position',
        [0, 0.5, 1],
        [-0.6, 1, 1, -0.35, 1, 1, -0.6, 1, 1]
    );

    const rightTrack = new THREE.VectorKeyframeTrack(
        'rightJaw.position',
        [0, 0.5, 1],
        [0.6, 1, 1, 0.35, 1, 1, 0.6, 1, 1]
    );

    const clip = new THREE.AnimationClip('SealAction', 1, [leftTrack, rightTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
