import * as THREE from 'three';
import { aluminum, darkSteel, rubber, redAccent } from '../utils/materials.js';

export function createRoboticHand(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // --- Palm ---
    const palmGeo = new THREE.BoxGeometry(2.0, 2.5, 0.5);
    const palm = new THREE.Mesh(palmGeo, aluminum);
    palm.position.y = 1.25;
    group.add(palm);

    const palmCore = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.3, 0.6), darkSteel);
    palm.add(palmCore);

    // --- Fingers ---
    const fingers = [];
    const fingerData = [
        { name: 'Thumb', x: -1.2, y: 0.5, z: 0, rotZ: Math.PI / 4, length: 0.8, joints: 2 },
        { name: 'Index', x: -0.75, y: 1.25, z: 0, rotZ: 0, length: 1.0, joints: 3 },
        { name: 'Middle', x: -0.25, y: 1.25, z: 0, rotZ: 0, length: 1.1, joints: 3 },
        { name: 'Ring', x: 0.25, y: 1.25, z: 0, rotZ: 0, length: 1.0, joints: 3 },
        { name: 'Pinky', x: 0.75, y: 1.25, z: 0, rotZ: 0, length: 0.8, joints: 3 },
    ];

    fingerData.forEach(data => {
        const baseJoint = new THREE.Group();
        baseJoint.position.set(data.x, data.y, data.z);
        baseJoint.rotation.z = data.rotZ;
        palm.add(baseJoint);

        const jointGroups = [];
        let currentParent = baseJoint;

        for (let i = 0; i < data.joints; i++) {
            const jointGrp = new THREE.Group();
            
            // Link geometry
            const linkGeo = new THREE.CylinderGeometry(0.2, 0.15, data.length);
            linkGeo.translate(0, data.length / 2, 0);
            const link = new THREE.Mesh(linkGeo, darkSteel);
            jointGrp.add(link);

            // Knuckle geometry
            const knuckleGeo = new THREE.SphereGeometry(0.25, 16, 16);
            const knuckle = new THREE.Mesh(knuckleGeo, redAccent);
            jointGrp.add(knuckle);

            if (i === data.joints - 1) {
                // Fingertip
                const tipGeo = new THREE.CapsuleGeometry(0.15, 0.3);
                tipGeo.translate(0, data.length + 0.15, 0);
                const tip = new THREE.Mesh(tipGeo, rubber);
                jointGrp.add(tip);
            }

            currentParent.add(jointGrp);
            jointGroups.push(jointGrp);

            // Next joint starts at end of current link
            const nextBase = new THREE.Group();
            nextBase.position.y = data.length;
            jointGrp.add(nextBase);
            currentParent = nextBase;
        }

        fingers.push(jointGroups);
    });

    // --- Animation (Opening and Closing) ---
    const tracks = [];
    const duration = 3.0;
    const times = [0, 1.5, 3.0];

    fingers.forEach((jointGroups) => {
        jointGroups.forEach((jointGrp, idx) => {
            // Close hand: rotate each joint along X axis
            const closedAngle = Math.PI / 2.5; 
            const angles = [0, closedAngle, 0];
            
            tracks.push(new THREE.NumberKeyframeTrack(`${jointGrp.uuid}.rotation[x]`, times, angles));
        });
    });

    // Animate thumb a bit differently (rotate Y as well)
    const thumbBase = fingers[0][0];
    const thumbAngles = [0, -Math.PI / 4, 0];
    tracks.push(new THREE.NumberKeyframeTrack(`${thumbBase.uuid}.rotation[y]`, times, thumbAngles));

    const graspClip = new THREE.AnimationClip('Grasp', duration, tracks);
    animationClips.push(graspClip);

    return { group, animationClips };
}
