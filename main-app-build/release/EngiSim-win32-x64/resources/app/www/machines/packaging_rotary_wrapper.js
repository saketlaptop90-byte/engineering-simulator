import { materials } from '../utils/materials.js';

export function createRotaryWrapper(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const tableGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const table = new THREE.Mesh(tableGeom, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    table.position.set(0, 0.1, 0);
    table.name = 'turntable';
    group.add(table);

    const mastGeom = new THREE.BoxGeometry(0.4, 3, 0.4);
    const mast = new THREE.Mesh(mastGeom, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    mast.position.set(-1.8, 1.5, 0);
    group.add(mast);

    const carriageGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const carriage = new THREE.Mesh(carriageGeom, materials.warning || new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    carriage.position.set(-1.3, 0.5, 0);
    carriage.name = 'carriage';
    group.add(carriage);

    const palletGeom = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    const pallet = new THREE.Mesh(palletGeom, materials.wood || new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
    pallet.position.set(0, 0.2, 0);
    table.add(pallet);
    
    const loadGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const load = new THREE.Mesh(loadGeom, materials.cardboard || new THREE.MeshStandardMaterial({ color: 0xd2b48c }));
    load.position.set(0, 0.9, 0);
    table.add(load);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2 - 0.001); // avoid exact 2pi

    const spinTrack = new THREE.QuaternionKeyframeTrack(
        'turntable.quaternion',
        [0, 1, 2],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ]
    );

    const moveTrack = new THREE.VectorKeyframeTrack(
        'carriage.position',
        [0, 2, 4],
        [
            -1.3, 0.5, 0,
            -1.3, 2.5, 0,
            -1.3, 0.5, 0
        ]
    );

    const clip1 = new THREE.AnimationClip('SpinAction', 2, [spinTrack]);
    const clip2 = new THREE.AnimationClip('WrapAction', 4, [moveTrack]);
    animationClips.push(clip1, clip2);

    return { group, animationClips };
}
