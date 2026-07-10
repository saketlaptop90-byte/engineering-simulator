import * as materials from '../utils/materials.js';

export function createQuadruped(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bodyMat = materials.quadrupedBody || new THREE.MeshStandardMaterial({color: 0xddcc11, metalness: 0.5, roughness: 0.5});
    const jointMat = materials.robotJoint || new THREE.MeshStandardMaterial({color: 0x111111});
    const legMat = materials.robotLeg || new THREE.MeshStandardMaterial({color: 0x333333});

    // Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 2), bodyMat);
    body.position.y = 1.2;
    body.name = 'QuadrupedBody';
    group.add(body);

    const positions = [
        [-0.6, 1.2, 0.8],  // Front Left
        [0.6, 1.2, 0.8],   // Front Right
        [-0.6, 1.2, -0.8], // Back Left
        [0.6, 1.2, -0.8]   // Back Right
    ];

    positions.forEach((pos, i) => {
        // Hip joint
        const hipGroup = new THREE.Group();
        hipGroup.position.set(pos[0], pos[1], pos[2]);
        hipGroup.name = `Hip_${i}`;
        
        const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), jointMat);
        hipGroup.add(hipJoint);

        // Upper leg
        const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), legMat);
        upperLeg.position.y = -0.3;
        hipGroup.add(upperLeg);
        
        // Knee joint
        const kneeGroup = new THREE.Group();
        kneeGroup.position.y = -0.6;
        kneeGroup.name = `Knee_${i}`;
        
        const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), jointMat);
        kneeGroup.add(kneeJoint);

        // Lower leg
        const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), legMat);
        lowerLeg.position.y = -0.3;
        kneeGroup.add(lowerLeg);

        hipGroup.add(kneeGroup);
        group.add(hipGroup);

        // Walking Animation - Alternating Gait
        const times = [0, 0.5, 1, 1.5, 2];
        // Diagonal pairs move together
        const phaseShift = (i === 0 || i === 3) ? 0 : 0.5;
        
        // Simulate a stepping motion for hips and knees
        const hipVals = [];
        const kneeVals = [];
        for (let t = 0; t <= 2; t += 0.5) {
            const timePhase = (t + phaseShift) % 2;
            if (timePhase === 0 || timePhase === 2) {
                hipVals.push(Math.PI/6, 0, 0);
                kneeVals.push(-Math.PI/4, 0, 0);
            } else if (timePhase === 0.5) {
                hipVals.push(-Math.PI/6, 0, 0);
                kneeVals.push(0, 0, 0);
            } else if (timePhase === 1) {
                hipVals.push(-Math.PI/4, 0, 0);
                kneeVals.push(Math.PI/8, 0, 0);
            } else if (timePhase === 1.5) {
                hipVals.push(0, 0, 0);
                kneeVals.push(-Math.PI/6, 0, 0);
            }
        }
        
        const hipTrack = new THREE.VectorKeyframeTrack(`${hipGroup.name}.rotation`, times, hipVals);
        const kneeTrack = new THREE.VectorKeyframeTrack(`${kneeGroup.name}.rotation`, times, kneeVals);
        animationClips.push(new THREE.AnimationClip(`WalkLeg${i}`, 2, [hipTrack, kneeTrack]));
    });

    // Body bobbing animation
    const bodyTimes = [0, 0.5, 1, 1.5, 2];
    const bodyVals = [0, 1.2, 0, 0, 1.15, 0, 0, 1.2, 0, 0, 1.15, 0, 0, 1.2, 0];
    const bodyTrack = new THREE.VectorKeyframeTrack(`${body.name}.position`, bodyTimes, bodyVals);
    animationClips.push(new THREE.AnimationClip('BodyBob', 2, [bodyTrack]));

    return { group, animationClips };
}
