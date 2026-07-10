import * as THREE from 'three';
import { aluminum, blackPlastic, redAccent, rubber, carbonFiber } from '../utils/materials.js';

export function createQuadcopter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // --- Central Hub ---
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const hub = new THREE.Mesh(hubGeo, blackPlastic);
    hub.position.y = 0.5;
    group.add(hub);

    const domeGeo = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, aluminum);
    dome.position.y = 0.15;
    hub.add(dome);

    const cameraGeo = new THREE.BoxGeometry(0.2, 0.2, 0.3);
    const camera = new THREE.Mesh(cameraGeo, redAccent);
    camera.position.set(0, -0.2, 0.4);
    hub.add(camera);

    // --- Arms and Rotors ---
    const numArms = 4;
    const armLength = 1.5;
    const rotors = [];

    for (let i = 0; i < numArms; i++) {
        const angle = (i / numArms) * Math.PI * 2 + Math.PI / 4;
        
        const armGroup = new THREE.Group();
        armGroup.position.set(Math.cos(angle) * (armLength / 2), 0, Math.sin(angle) * (armLength / 2));
        armGroup.rotation.y = -angle;
        hub.add(armGroup);

        // Arm body
        const armGeo = new THREE.BoxGeometry(armLength, 0.1, 0.15);
        const arm = new THREE.Mesh(armGeo, carbonFiber);
        armGroup.add(arm);

        // Motor
        const motorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
        const motor = new THREE.Mesh(motorGeo, aluminum);
        motor.position.x = armLength / 2;
        motor.position.y = 0.1;
        armGroup.add(motor);

        // Rotor
        const rotorGeo = new THREE.BoxGeometry(1.2, 0.02, 0.1);
        const rotor = new THREE.Mesh(rotorGeo, blackPlastic);
        rotor.position.y = 0.15;
        motor.add(rotor);

        // Leg
        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const leg = new THREE.Mesh(legGeo, rubber);
        leg.position.set(armLength / 2 - 0.2, -0.3, 0);
        armGroup.add(leg);

        rotors.push({ mesh: rotor, direction: i % 2 === 0 ? 1 : -1 });
    }

    // --- Animation (Hovering and Spinning) ---
    const tracks = [];
    const duration = 1.0;
    const times = [0, 0.25, 0.5, 0.75, 1.0];

    // Hover bob
    const hoverY = [0.5, 0.6, 0.5, 0.4, 0.5];
    tracks.push(new THREE.NumberKeyframeTrack(`${hub.uuid}.position[y]`, times, hoverY));

    // Slight tilt
    const tiltX = [0, 0.05, 0, -0.05, 0];
    tracks.push(new THREE.NumberKeyframeTrack(`${hub.uuid}.rotation[x]`, times, tiltX));

    // Fast rotor spinning
    rotors.forEach((r) => {
        // Rotors spin very fast, we can animate a full circle multiple times or just linearly from 0 to 2PI * direction * speed
        // For a seamless loop, 1 revolution per duration
        const rotTimes = [0, 1.0];
        const rotAngles = [0, Math.PI * 20 * r.direction];
        tracks.push(new THREE.NumberKeyframeTrack(`${r.mesh.uuid}.rotation[y]`, rotTimes, rotAngles));
    });

    const flightClip = new THREE.AnimationClip('Flight', duration, tracks);
    animationClips.push(flightClip);

    return { group, animationClips };
}
