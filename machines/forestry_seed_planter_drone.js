import {
    greenPaintMaterial,
    metalMaterial,
    blackRubberMaterial,
    glassMaterial
} from '../utils/materials.js';

export function createSeedPlanterDrone(THREE) {
    const group = new THREE.Group();
    group.name = 'SeedPlanterDrone';
    const animationClips = [];

    // Drone Body
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 16);
    const body = new THREE.Mesh(bodyGeo, greenPaintMaterial);
    group.add(body);

    // Seed Hopper
    const hopperGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const hopper = new THREE.Mesh(hopperGeo, glassMaterial);
    hopper.position.y = 0.4;
    body.add(hopper);

    // Arms and Rotors
    const numRotors = 6;
    const armLength = 2.5;
    for (let i = 0; i < numRotors; i++) {
        const angle = (i / numRotors) * Math.PI * 2;
        
        // Arm
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, armLength);
        const arm = new THREE.Mesh(armGeo, metalMaterial);
        arm.position.set(Math.cos(angle) * armLength/2, 0, Math.sin(angle) * armLength/2);
        arm.rotation.y = -angle;
        arm.rotation.z = Math.PI / 2;
        body.add(arm);

        // Rotor Motor
        const motorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4);
        const motor = new THREE.Mesh(motorGeo, metalMaterial);
        motor.position.set(Math.cos(angle) * armLength, 0.2, Math.sin(angle) * armLength);
        body.add(motor);

        // Propeller
        const propGeo = new THREE.BoxGeometry(1.8, 0.05, 0.1);
        const prop = new THREE.Mesh(propGeo, blackRubberMaterial);
        prop.position.set(Math.cos(angle) * armLength, 0.45, Math.sin(angle) * armLength);
        prop.name = `propeller_${i}`;
        body.add(prop);
    }

    // Seed Dispenser Mechanism
    const dispenserGeo = new THREE.CylinderGeometry(0.3, 0.1, 1);
    const dispenser = new THREE.Mesh(dispenserGeo, metalMaterial);
    dispenser.position.y = -0.9;
    body.add(dispenser);

    // Rotor Animation
    const times = [0, 0.5, 1];
    const tracks = [];
    
    for (let i = 0; i < numRotors; i++) {
        const propQuats = [];
        const qProp = new THREE.Quaternion();
        const baseAngle = (i / numRotors) * Math.PI * 2;
        
        [0, Math.PI, Math.PI * 2].forEach(rotAngle => {
            qProp.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotAngle);
            propQuats.push(qProp.x, qProp.y, qProp.z, qProp.w);
        });
        
        const track = new THREE.QuaternionKeyframeTrack(`propeller_${i}.quaternion`, times, propQuats);
        tracks.push(track);
    }

    // Drone hover animation
    const posTimes = [0, 2, 4];
    const posVals = [
        0, 0, 0,
        0, 0.5, 0,
        0, 0, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack('.position', posTimes, posVals);
    tracks.push(posTrack);

    const clip = new THREE.AnimationClip('DroneFlight', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
