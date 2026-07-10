import { glass, aluminum, gold } from '../utils/materials.js';

export function createAcoustoOpticDeflector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), aluminum);
    base.position.y = 0.5;
    group.add(base);

    const crystal = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 1), glass);
    crystal.position.y = 1.75;
    group.add(crystal);

    const transducer = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), gold);
    transducer.position.y = 1.0;
    group.add(transducer);

    const inLaser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.7 }));
    inLaser.position.set(-2, 1.75, 0);
    inLaser.rotation.z = Math.PI / 2;
    group.add(inLaser);

    const outLaser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.7 }));
    outLaser.position.set(1.5, 1.75, 0);
    outLaser.rotation.z = Math.PI / 2;
    outLaser.name = 'OutLaser';
    group.add(outLaser);

    const times = [0, 1, 2, 3, 4];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2 - 0.2);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2 + 0.2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2 - 0.2);

    const track = new THREE.QuaternionKeyframeTrack('OutLaser.quaternion', [0, 2, 4], [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
    ]);
    const clip = new THREE.AnimationClip('Deflect', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
