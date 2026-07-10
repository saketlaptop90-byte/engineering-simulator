import { steel, aluminum, copper, darkSteel, redAccent, blueAccent } from '../utils/materials.js';

export function createIndustrialChiller(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Evaporator Barrel (Bottom)
    const evaporator = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32), steel);
    evaporator.rotation.z = Math.PI / 2;
    evaporator.position.set(0, -1.5, 1);
    group.add(evaporator);

    // Condenser Barrel (Bottom adjacent)
    const condenser = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32), steel);
    condenser.rotation.z = Math.PI / 2;
    condenser.position.set(0, -1.5, -1.5);
    group.add(condenser);

    // Centrifugal Compressor (Top)
    const compressorGroup = new THREE.Group();
    compressorGroup.position.set(0, 1.5, -0.25);
    
    const volute = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), darkSteel);
    compressorGroup.add(volute);

    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32), aluminum);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(2, 0, 0);
    compressorGroup.add(motor);

    const impeller = new THREE.Group();
    impeller.name = "ChillerImpeller";
    impeller.position.set(0, 0, 1.2);
    const impHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.4, 16), aluminum);
    impHub.rotation.x = Math.PI / 2;
    impeller.add(impHub);
    compressorGroup.add(impeller);

    group.add(compressorGroup);

    // Connecting Pipes
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), copper);
    pipe1.position.set(-1.5, 0, 0.4);
    group.add(pipe1);

    const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), copper);
    pipe2.position.set(1.5, 0, -1);
    group.add(pipe2);

    // Animation for Impeller
    const times = [0, 0.25, 0.5];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const impTrack = new THREE.QuaternionKeyframeTrack('ChillerImpeller.quaternion', times, [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]);

    const clip = new THREE.AnimationClip('chiller_operation', 0.5, [impTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
