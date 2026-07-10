import { darkSteel, steel, rubber, plastic } from '../utils/materials.js';

export function createCableWeightStack(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 1), darkSteel);
    base.position.set(0, 0.025, 0);
    group.add(base);

    // Frame Pillars
    const pillarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 0.05), darkSteel);
    pillarLeft.position.set(-0.4, 1.1, -0.4);
    group.add(pillarLeft);

    const pillarRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 0.05), darkSteel);
    pillarRight.position.set(0.4, 1.1, -0.4);
    group.add(pillarRight);

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.05), darkSteel);
    topBar.position.set(0, 2.2, -0.4);
    group.add(topBar);

    // Guide Rods
    const rodLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1), steel);
    rodLeft.position.set(-0.2, 1.05, -0.4);
    group.add(rodLeft);

    const rodRight = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1), steel);
    rodRight.position.set(0.2, 1.05, -0.4);
    group.add(rodRight);

    // Weight Stack (Static Bottom Weights)
    const staticWeights = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const weight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.15), plastic);
        weight.position.set(0, 0.1 + i * 0.085, -0.4);
        staticWeights.add(weight);
    }
    group.add(staticWeights);

    // Moving Weight Stack
    const movingWeights = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const weight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.15), plastic);
        weight.position.set(0, i * 0.085, 0); // Relative to moving stack group
        movingWeights.add(weight);
    }
    movingWeights.position.set(0, 0.1 + 10 * 0.085, -0.4);
    group.add(movingWeights);

    // Cable Pulley
    const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), rubber);
    pulley.rotation.x = Math.PI / 2;
    pulley.position.set(0, 2.1, -0.3);
    group.add(pulley);

    // Cable Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4), rubber);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 1.5, 0);
    group.add(handle);

    // Animation: Lifting weights and pulling handle
    const weightTrack = new THREE.VectorKeyframeTrack(
        `${movingWeights.uuid}.position`,
        [0, 1, 2],
        [
            0, 0.1 + 10 * 0.085, -0.4, 
            0, 0.1 + 10 * 0.085 + 0.6, -0.4, 
            0, 0.1 + 10 * 0.085, -0.4
        ]
    );

    const handleTrack = new THREE.VectorKeyframeTrack(
        `${handle.uuid}.position`,
        [0, 1, 2],
        [
            0, 1.5, 0,
            0, 0.9, 0,
            0, 1.5, 0
        ]
    );

    const pulleyRot1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0)).toArray();
    const pulleyRot2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, Math.PI)).toArray();
    const pulleyRot3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0)).toArray();

    const pulleyTrack = new THREE.QuaternionKeyframeTrack(
        `${pulley.uuid}.quaternion`,
        [0, 1, 2],
        [...pulleyRot1, ...pulleyRot2, ...pulleyRot3]
    );

    const clip = new THREE.AnimationClip('LiftWeight', 2, [weightTrack, handleTrack, pulleyTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
