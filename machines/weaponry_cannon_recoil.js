import { materials } from '../utils/materials.js';

export function createCannonRecoil(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Carriage
    const carriageGeo = new THREE.BoxGeometry(0.8, 0.4, 1.5);
    const carriage = new THREE.Mesh(carriageGeo, materials.wood);
    carriage.position.y = -0.2;
    group.add(carriage);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.0);
    const barrel = new THREE.Mesh(barrelGeo, materials.darkSteel);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.3, 0);
    group.add(barrel);

    // Animation
    const times = [0, 0.1, 1.0, 2.0];
    const barrelValues = [0, 0, 0,  0, 0, -0.5,  0, 0, 0,  0, 0, 0];
    const carriageValues = [0, -0.2, 0,  0, -0.2, -0.2,  0, -0.2, 0,  0, -0.2, 0];

    const barrelTrack = new THREE.VectorKeyframeTrack(`${barrel.uuid}.position`, times, barrelValues);
    const carriageTrack = new THREE.VectorKeyframeTrack(`${carriage.uuid}.position`, times, carriageValues);
    
    const clip = new THREE.AnimationClip('CannonRecoilAction', 2, [barrelTrack, carriageTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
