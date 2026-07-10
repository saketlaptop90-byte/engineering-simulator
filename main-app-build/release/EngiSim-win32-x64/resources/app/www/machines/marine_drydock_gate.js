import { materials } from '../utils/materials.js';

export function createDrydockGate(THREE) {
    const group = new THREE.Group();
    group.name = 'drydockGateSystem';
    const animationClips = [];

    const wallGeo = new THREE.BoxGeometry(40, 20, 5);
    const leftWall = new THREE.Mesh(wallGeo, materials.concrete || materials.metal);
    leftWall.position.set(-30, 10, 0);
    group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, materials.concrete || materials.metal);
    rightWall.position.set(30, 10, 0);
    group.add(rightWall);

    const gateGeo = new THREE.BoxGeometry(20, 20, 4);
    const gate = new THREE.Mesh(gateGeo, materials.steel);
    gate.name = 'gate';
    gate.position.set(0, -10, 0);
    group.add(gate);

    const liftGeo = new THREE.CylinderGeometry(1, 1, 25, 16);
    const lift1 = new THREE.Mesh(liftGeo, materials.metal);
    lift1.position.set(-11, 12.5, 0);
    group.add(lift1);

    const lift2 = new THREE.Mesh(liftGeo, materials.metal);
    lift2.position.set(11, 12.5, 0);
    group.add(lift2);

    const gateTrack = new THREE.NumberKeyframeTrack(
        'gate.position[y]',
        [0, 5, 10, 15, 20],
        [-10, 10, 10, -10, -10]
    );
    const clip = new THREE.AnimationClip('OperateGate', 20, [gateTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
