import { darkSteel, steel, rubber, plastic } from '../utils/materials.js';

export function createTreadmill(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Frame
    const frameGeometry = new THREE.BoxGeometry(1, 0.1, 2.2);
    const frame = new THREE.Mesh(frameGeometry, darkSteel);
    frame.position.y = 0.05;
    group.add(frame);

    // Treadmill Belt (Moving part)
    const beltGeometry = new THREE.BoxGeometry(0.8, 0.12, 2.1);
    const belt = new THREE.Mesh(beltGeometry, rubber);
    belt.position.y = 0.05;
    group.add(belt);

    // Front console mast
    const mastLeftGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2);
    const mastLeft = new THREE.Mesh(mastLeftGeom, darkSteel);
    mastLeft.position.set(-0.4, 0.6, -1);
    group.add(mastLeft);

    const mastRightGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2);
    const mastRight = new THREE.Mesh(mastRightGeom, darkSteel);
    mastRight.position.set(0.4, 0.6, -1);
    group.add(mastRight);

    // Console
    const consoleGeom = new THREE.BoxGeometry(0.9, 0.3, 0.2);
    const consoleMesh = new THREE.Mesh(consoleGeom, plastic);
    consoleMesh.position.set(0, 1.2, -0.9);
    consoleMesh.rotation.x = -Math.PI / 4;
    group.add(consoleMesh);
    
    // Handrails
    const railGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
    const railLeft = new THREE.Mesh(railGeom, plastic);
    railLeft.position.set(-0.4, 1.0, -0.5);
    railLeft.rotation.x = Math.PI / 2;
    group.add(railLeft);
    
    const railRight = new THREE.Mesh(railGeom, plastic);
    railRight.position.set(0.4, 1.0, -0.5);
    railRight.rotation.x = Math.PI / 2;
    group.add(railRight);

    // Rollers
    const rollerGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
    const rollerFront = new THREE.Mesh(rollerGeom, steel);
    rollerFront.position.set(0, 0.06, -1.05);
    rollerFront.rotation.z = Math.PI / 2;
    group.add(rollerFront);

    const rollerBack = new THREE.Mesh(rollerGeom, steel);
    rollerBack.position.set(0, 0.06, 1.05);
    rollerBack.rotation.z = Math.PI / 2;
    group.add(rollerBack);

    // Rotate rollers animation
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2)).toArray();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, Math.PI/2)).toArray();
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, 0, Math.PI/2)).toArray();
    
    const rollerFrontRotTrackQuat = new THREE.QuaternionKeyframeTrack(
        `${rollerFront.uuid}.quaternion`,
        [0, 0.5, 1],
        [...q1, ...q2, ...q3]
    );

    const rollerBackRotTrackQuat = new THREE.QuaternionKeyframeTrack(
        `${rollerBack.uuid}.quaternion`,
        [0, 0.5, 1],
        [...q1, ...q2, ...q3]
    );

    const clip = new THREE.AnimationClip('TreadmillRun', 1, [rollerFrontRotTrackQuat, rollerBackRotTrackQuat]);
    animationClips.push(clip);

    return { group, animationClips };
}
