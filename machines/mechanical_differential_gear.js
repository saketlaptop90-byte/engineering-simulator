import * as materials from '../utils/materials.js';

export function createDifferentialGear(THREE) {
    const group = new THREE.Group();
    group.name = "Differential Gear Assembly";

    const steel = materials.steel || materials.default?.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const brass = materials.brass || materials.default?.brass || new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.9, roughness: 0.3 });

    // Base housing
    const housingGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const housing = new THREE.Mesh(housingGeometry, steel);
    housing.rotation.x = Math.PI / 2;
    group.add(housing);

    // Left and right axles
    const axleGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const leftAxle = new THREE.Mesh(axleGeom, steel);
    leftAxle.name = 'leftAxle';
    leftAxle.position.x = -3;
    leftAxle.rotation.z = Math.PI / 2;
    group.add(leftAxle);

    const rightAxle = new THREE.Mesh(axleGeom, steel);
    rightAxle.name = 'rightAxle';
    rightAxle.position.x = 3;
    rightAxle.rotation.z = Math.PI / 2;
    group.add(rightAxle);

    // Ring gear
    const ringGeom = new THREE.TorusGeometry(3, 0.5, 16, 64);
    const ringGear = new THREE.Mesh(ringGeom, brass);
    ringGear.name = 'ringGear';
    ringGear.rotation.y = Math.PI / 2;
    group.add(ringGear);

    // Animation: rotating ring gear and axles
    const animationClips = [];
    const ringTrack = new THREE.NumberKeyframeTrack('ringGear.rotation[x]', [0, 2], [0, Math.PI * 2]);
    const leftAxleTrack = new THREE.NumberKeyframeTrack('leftAxle.rotation[y]', [0, 2], [0, Math.PI * 2]);
    const rightAxleTrack = new THREE.NumberKeyframeTrack('rightAxle.rotation[y]', [0, 2], [0, Math.PI * 2]);
    
    const clip = new THREE.AnimationClip('Drive', 2, [ringTrack, leftAxleTrack, rightAxleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
