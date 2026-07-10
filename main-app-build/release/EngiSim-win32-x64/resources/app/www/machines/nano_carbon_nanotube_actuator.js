import * as CustomMaterials from '../utils/materials.js';

export function createCarbonNanotubeActuator(THREE) {
    const group = new THREE.Group();
    group.name = "CarbonNanotubeActuator";
    const animationClips = [];

    const carbonMat = CustomMaterials.carbonMaterial || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.5, wireframe: true });
    const electrodeMat = CustomMaterials.goldMaterial || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.2 });

    // Nanotube Body
    const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 5, 32, 10);
    const tube = new THREE.Mesh(tubeGeo, carbonMat);
    tube.name = "tube";
    group.add(tube);

    // Electrodes
    const el1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), electrodeMat);
    el1.position.y = 2.5;
    group.add(el1);
    const el2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.8), electrodeMat);
    el2.position.y = -2.5;
    group.add(el2);

    // Animation: Actuation (Bending or Expanding)
    const times = [0, 1, 2];
    const scaleValues = [
        1, 1, 1,
        1.2, 0.8, 1.2,
        1, 1, 1
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${tube.name}.scale`, times, scaleValues);
    const clip = new THREE.AnimationClip('Actuate', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
