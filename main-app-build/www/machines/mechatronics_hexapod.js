import * as THREE from 'three';
import { aluminum, blackPlastic, redAccent, rubber } from '../utils/materials.js';

export function createHexapod(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // --- Body ---
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
    const body = new THREE.Mesh(bodyGeo, blackPlastic);
    body.position.y = 1.5;
    group.add(body);

    const eyeGeo = new THREE.BoxGeometry(0.5, 0.2, 0.2);
    const eye = new THREE.Mesh(eyeGeo, redAccent);
    eye.position.set(0, 0, 1.4);
    body.add(eye);

    // --- Legs ---
    const legs = [];
    const numLegs = 6;
    const legRadius = 1.6;

    for (let i = 0; i < numLegs; i++) {
        const angle = (i / numLegs) * Math.PI * 2 + (Math.PI / 6); // offset so flat sides match
        
        const legGroup = new THREE.Group();
        legGroup.position.set(Math.cos(angle) * legRadius, 0, Math.sin(angle) * legRadius);
        legGroup.rotation.y = -angle;

        // Coxa (hip)
        const coxaGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
        const coxa = new THREE.Mesh(coxaGeo, aluminum);
        coxa.position.x = 0.4;
        legGroup.add(coxa);

        // Femur joint
        const femurJoint = new THREE.Group();
        femurJoint.position.x = 0.8;
        legGroup.add(femurJoint);

        const femurGeo = new THREE.BoxGeometry(1.2, 0.3, 0.3);
        femurGeo.translate(0.6, 0, 0);
        const femur = new THREE.Mesh(femurGeo, blackPlastic);
        femurJoint.add(femur);

        // Tibia joint
        const tibiaJoint = new THREE.Group();
        tibiaJoint.position.x = 1.2;
        femurJoint.add(tibiaJoint);

        const tibiaGeo = new THREE.CylinderGeometry(0.15, 0.05, 1.5);
        tibiaGeo.translate(0, -0.75, 0);
        const tibia = new THREE.Mesh(tibiaGeo, aluminum);
        
        const footGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const foot = new THREE.Mesh(footGeo, rubber);
        foot.position.y = -1.5;
        tibia.add(foot);

        tibiaJoint.add(tibia);

        body.add(legGroup);

        legs.push({ legGroup, femurJoint, tibiaJoint });
    }

    // --- Animation (Walking Cycle) ---
    const tracks = [];
    const duration = 2.0;

    legs.forEach((leg, i) => {
        const timeOffset = (i % 2 === 0) ? 0 : duration / 2;
        const times = [0, duration * 0.25, duration * 0.5, duration * 0.75, duration];
        
        // Move femur up and down
        const femurAngles = [];
        const tibiaAngles = [];
        const coxaAngles = [];

        for (let t = 0; t < times.length; t++) {
            const phase = ((times[t] + timeOffset) % duration) / duration;
            
            // Lift phase
            if (phase < 0.5) {
                femurAngles.push(Math.sin(phase * Math.PI * 2) * 0.5);
                tibiaAngles.push(-Math.sin(phase * Math.PI * 2) * 0.3 - 0.5);
                coxaAngles.push(Math.sin(phase * Math.PI * 2) * 0.4);
            } else {
                // Ground phase
                femurAngles.push(0);
                tibiaAngles.push(-0.5);
                coxaAngles.push(-Math.sin((phase - 0.5) * Math.PI * 2) * 0.4);
            }
        }

        const femurPath = `${leg.femurJoint.uuid}.rotation[z]`;
        const tibiaPath = `${leg.tibiaJoint.uuid}.rotation[z]`;
        const coxaPath = `${leg.legGroup.uuid}.rotation[y]`;

        tracks.push(new THREE.NumberKeyframeTrack(femurPath, times, femurAngles));
        tracks.push(new THREE.NumberKeyframeTrack(tibiaPath, times, tibiaAngles));
        // Note: coxa base rotation is already set, so we must add to it.
        const baseAngle = -((i / numLegs) * Math.PI * 2 + (Math.PI / 6));
        const absoluteCoxaAngles = coxaAngles.map(a => baseAngle + a);
        tracks.push(new THREE.NumberKeyframeTrack(coxaPath, times, absoluteCoxaAngles));
    });

    const bodyTimes = [0, duration * 0.25, duration * 0.5, duration * 0.75, duration];
    const bodyY = [1.5, 1.4, 1.5, 1.4, 1.5];
    tracks.push(new THREE.NumberKeyframeTrack(`${body.uuid}.position[y]`, bodyTimes, bodyY));

    const walkClip = new THREE.AnimationClip('Walk', duration, tracks);
    animationClips.push(walkClip);

    return { group, animationClips };
}
