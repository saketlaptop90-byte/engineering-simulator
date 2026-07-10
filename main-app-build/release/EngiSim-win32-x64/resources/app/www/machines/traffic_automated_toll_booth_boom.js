import { metals, plastics, lights, rubbers } from '../utils/materials.js';

export function createAutomatedTollBoothBoom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base cabin
    const baseGeometry = new THREE.BoxGeometry(2, 4, 2);
    const base = new THREE.Mesh(baseGeometry, metals?.paintedWhite || new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    base.position.y = 2;
    group.add(base);

    // Boom arm pivot
    const pivot = new THREE.Group();
    pivot.position.set(0, 3, 1);
    group.add(pivot);

    // Boom arm
    const boomGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
    boomGeometry.rotateZ(Math.PI / 2);
    boomGeometry.translate(3, 0, 0);
    const boom = new THREE.Mesh(boomGeometry, plastics?.redWhiteStripes || new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    pivot.add(boom);

    // Animation: Open and close boom
    const times = [0, 2, 4, 6];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);

    const values = [
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray(),
        ...q4.toArray()
    ];

    const rotationTrack = new THREE.QuaternionKeyframeTrack(`${pivot.uuid}.quaternion`, times, values);
    const clip = new THREE.AnimationClip('OperateBoom', 6, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
