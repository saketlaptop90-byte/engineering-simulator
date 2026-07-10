import { materials } from '../utils/materials.js';

export function createInclinometerProbe(THREE) {
    const group = new THREE.Group();
    group.name = "InclinometerProbe";
    const animationClips = [];

    // Probe body
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const body = new THREE.Mesh(bodyGeo, materials.metal);
    group.add(body);

    // Wheels
    const wheelGroup = new THREE.Group();
    group.add(wheelGroup);

    const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    
    const topWheel = new THREE.Mesh(wheelGeo, materials.darkMetal);
    topWheel.rotation.z = Math.PI / 2;
    topWheel.position.set(0.25, 1.5, 0);
    wheelGroup.add(topWheel);

    const bottomWheel = new THREE.Mesh(wheelGeo, materials.darkMetal);
    bottomWheel.rotation.z = Math.PI / 2;
    bottomWheel.position.set(0.25, -1.5, 0);
    wheelGroup.add(bottomWheel);

    // Cable
    const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 10, 8);
    const cable = new THREE.Mesh(cableGeo, materials.darkMetal);
    cable.position.y = 7;
    group.add(cable);

    // Animation: Lowering down the borehole
    const duration = 5;
    
    const moveTimes = [0, duration];
    const moveValues = [10, -10];
    const moveTrack = new THREE.NumberKeyframeTrack(".position[y]", moveTimes, moveValues);

    const measureClip = new THREE.AnimationClip("Measure", duration, [moveTrack]);
    animationClips.push(measureClip);

    return { group, animationClips };
}
