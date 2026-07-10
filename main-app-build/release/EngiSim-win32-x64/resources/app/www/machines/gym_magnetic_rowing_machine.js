import { darkSteel, steel, rubber, plastic } from '../utils/materials.js';

export function createRowingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Rail
    const railGeometry = new THREE.BoxGeometry(0.15, 0.05, 2.5);
    const rail = new THREE.Mesh(railGeometry, steel);
    rail.position.set(0, 0.15, 0);
    group.add(rail);

    // Front Support & Flywheel Housing
    const frontSupport = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.6), plastic);
    frontSupport.position.set(0, 0.2, -1.2);
    group.add(frontSupport);

    // Flywheel
    const flywheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const flywheel = new THREE.Mesh(flywheelGeometry, darkSteel);
    flywheel.rotation.z = Math.PI / 2;
    flywheel.position.set(0, 0.3, -1.3);
    group.add(flywheel);

    // Rear Support
    const rearSupport = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), darkSteel);
    rearSupport.position.set(0, 0.075, 1.2);
    group.add(rearSupport);

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.3), rubber);
    seat.position.set(0, 0.2, 0); // Seat slides on Z
    group.add(seat);

    // Handlebar
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4), rubber);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.4, -0.9);
    group.add(handle);

    // Handle string
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.4), darkSteel);
    string.rotation.x = Math.PI / 2;
    string.position.set(0, 0.4, -1.1);
    group.add(string);

    // Animation
    // Seat sliding back and forth
    const seatTrack = new THREE.VectorKeyframeTrack(
        `${seat.uuid}.position`,
        [0, 1, 2],
        [0, 0.2, 0.8, 0, 0.2, -0.5, 0, 0.2, 0.8]
    );

    // Handle pulling back and forth
    const handleTrack = new THREE.VectorKeyframeTrack(
        `${handle.uuid}.position`,
        [0, 1, 2],
        [0, 0.4, 0.5, 0, 0.4, -0.9, 0, 0.4, 0.5]
    );
    
    // Flywheel spinning
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2)).toArray();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, Math.PI/2)).toArray();
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, 0, Math.PI/2)).toArray();

    const flywheelTrack = new THREE.QuaternionKeyframeTrack(
        `${flywheel.uuid}.quaternion`,
        [0, 0.5, 1, 1.5, 2],
        [...q1, ...q2, ...q3, ...q2, ...q1] 
    );

    const clip = new THREE.AnimationClip('Rowing', 2, [seatTrack, handleTrack, flywheelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
