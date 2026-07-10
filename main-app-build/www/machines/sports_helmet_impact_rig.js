import { materials } from '../utils/materials.js';

export function createHelmetImpactRig(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(2, 0.2, 2);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    group.add(base);

    const towerGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const tower1 = new THREE.Mesh(towerGeo, materials.aluminum);
    tower1.position.set(-0.6, 2, 0);
    const tower2 = new THREE.Mesh(towerGeo, materials.aluminum);
    tower2.position.set(0.6, 2, 0);
    group.add(tower1, tower2);

    const headGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const head = new THREE.Mesh(headGeo, materials.plastic);
    head.position.set(0, 0.4, 0);
    group.add(head);

    const helmetGeo = new THREE.SphereGeometry(0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 + 0.2);
    const helmet = new THREE.Mesh(helmetGeo, materials.carbonFiber);
    helmet.position.set(0, 0.4, 0);
    group.add(helmet);

    const dropWeightGroup = new THREE.Group();
    dropWeightGroup.name = 'dropWeight';
    const weightGeo = new THREE.BoxGeometry(1.4, 0.4, 0.6);
    const weight = new THREE.Mesh(weightGeo, materials.steel);
    dropWeightGroup.add(weight);
    dropWeightGroup.position.set(0, 3.5, 0);
    group.add(dropWeightGroup);

    const times = [0, 1, 1.2, 2, 3];
    const posVals = [
        0, 3.5, 0,
        0, 0.9, 0, 
        0, 1.5, 0, 
        0, 3.5, 0,
        0, 3.5, 0
    ];
    const dropTrack = new THREE.VectorKeyframeTrack('dropWeight.position', times, posVals);
    
    const clip = new THREE.AnimationClip('ImpactAction', 3, [dropTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
