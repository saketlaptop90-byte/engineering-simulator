import { glass, aluminum, gold, steel } from '../utils/materials.js';

export function createObservatoryTelescope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Mount
    const mountGeo = new THREE.CylinderGeometry(1, 1.2, 1, 32);
    const mount = new THREE.Mesh(mountGeo, steel);
    mount.position.y = 0.5;
    group.add(mount);

    // Fork
    const forkGeo = new THREE.BoxGeometry(2.5, 0.5, 1);
    const fork = new THREE.Mesh(forkGeo, aluminum);
    fork.position.y = 1.25;
    fork.name = 'telescopeFork';
    group.add(fork);

    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 1), aluminum);
    arm1.position.set(1, 1, 0);
    fork.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 1), aluminum);
    arm2.position.set(-1, 1, 0);
    fork.add(arm2);

    // Tube
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    tubeGeo.rotateX(Math.PI / 2);
    const tube = new THREE.Mesh(tubeGeo, steel);
    tube.position.set(0, 2, 0);
    tube.name = 'telescopeTube';
    fork.add(tube);

    // Lens
    const lensGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 32);
    lensGeo.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.position.z = 1.95;
    lens.name = 'focusLens';
    tube.add(lens);

    // Animations
    // Fork rotating (azimuth)
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 4);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);

    const forkRotTrack = new THREE.QuaternionKeyframeTrack(
        'telescopeFork.quaternion',
        [0, 2, 6, 8],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()]
    );

    // Tube rotating (elevation)
    const tq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const tq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 6);
    const tq3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);

    const tubeRotTrack = new THREE.QuaternionKeyframeTrack(
        'telescopeTube.quaternion',
        [0, 4, 8],
        [...tq1.toArray(), ...tq2.toArray(), ...tq3.toArray()]
    );

    // Lens focusing (moving in Z)
    const lensPosTrack = new THREE.VectorKeyframeTrack(
        'focusLens.position',
        [0, 4, 8],
        [0, 0, 1.95,  0, 0, 1.8,  0, 0, 1.95]
    );

    const clip = new THREE.AnimationClip('Telescope_Tracking', 8, [forkRotTrack, tubeRotTrack, lensPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
