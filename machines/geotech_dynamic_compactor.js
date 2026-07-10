import { materials } from '../utils/materials.js';

export function createDynamicCompactor(THREE) {
    const group = new THREE.Group();
    group.name = "DynamicCompactor";
    const animationClips = [];

    // Crane base
    const baseGeo = new THREE.BoxGeometry(5, 2, 6);
    const base = new THREE.Mesh(baseGeo, materials.yellowMetal);
    base.position.y = 1;
    group.add(base);

    // Tracks
    const trackGeo = new THREE.BoxGeometry(1.5, 1.5, 8);
    const leftTrack = new THREE.Mesh(trackGeo, materials.darkMetal);
    leftTrack.position.set(-3.25, 0.75, 0);
    group.add(leftTrack);

    const rightTrack = new THREE.Mesh(trackGeo, materials.darkMetal);
    rightTrack.position.set(3.25, 0.75, 0);
    group.add(rightTrack);

    // Crane boom
    const boomGeo = new THREE.BoxGeometry(0.8, 20, 0.8);
    const boom = new THREE.Mesh(boomGeo, materials.metal);
    boom.position.set(0, 10, 4);
    boom.rotation.x = -Math.PI / 6;
    group.add(boom);

    // Heavy weight (pounder)
    const weightGeo = new THREE.BoxGeometry(2, 2, 2);
    const weight = new THREE.Mesh(weightGeo, materials.darkMetal);
    weight.name = "Weight";
    weight.position.set(0, 0, 14);
    group.add(weight);

    // Cable
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 20, 8);
    const cable = new THREE.Mesh(cableGeo, materials.darkMetal);
    cable.name = "Cable";
    cable.position.set(0, 10, 14);
    group.add(cable);

    // Animation: Lifting and dropping the weight
    const duration = 4;
    
    // Weight movement
    const liftTimes = [0, 3, 3.2, 4];
    const liftValues = [1, 18, 1, 1];
    const weightTrack = new THREE.NumberKeyframeTrack("Weight.position[y]", liftTimes, liftValues);

    // Cable scaling to match weight
    const cableScaleTimes = [0, 3, 3.2, 4];
    const cableScaleValues = [1, 0.1, 1, 1]; // Approximate length scaling
    const cableScaleTrack = new THREE.NumberKeyframeTrack("Cable.scale[y]", cableScaleTimes, cableScaleValues);
    
    const cableMoveTimes = [0, 3, 3.2, 4];
    const cableMoveValues = [10.5, 19, 10.5, 10.5]; // Keep top anchored roughly
    const cableMoveTrack = new THREE.NumberKeyframeTrack("Cable.position[y]", cableMoveTimes, cableMoveValues);

    const dropClip = new THREE.AnimationClip("Drop", duration, [weightTrack, cableScaleTrack, cableMoveTrack]);
    animationClips.push(dropClip);

    return { group, animationClips };
}
