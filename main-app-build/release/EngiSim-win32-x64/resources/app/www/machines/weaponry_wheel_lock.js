import { materials } from '../utils/materials.js';

export function createWheelLock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const plateGeo = new THREE.BoxGeometry(0.1, 0.4, 1.0);
    const plate = new THREE.Mesh(plateGeo, materials.iron);
    group.add(plate);

    const wheelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.15);
    const wheel = new THREE.Mesh(wheelGeo, materials.darkSteel);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0.1, 0, 0);
    group.add(wheel);

    const dogGeo = new THREE.BoxGeometry(0.05, 0.3, 0.05);
    const dog = new THREE.Mesh(dogGeo, materials.brass);
    dog.position.set(0.1, 0.2, -0.2);
    group.add(dog);

    // Animation
    const times = [0, 1, 2];
    const wheelValues = [0, Math.PI * 4, 0]; // Spins
    const dogValues = [0, Math.PI/4, 0]; // Lowers onto wheel
    
    const wheelTrack = new THREE.NumberKeyframeTrack(`${wheel.uuid}.rotation[x]`, times, wheelValues);
    const dogTrack = new THREE.NumberKeyframeTrack(`${dog.uuid}.rotation[x]`, times, dogValues);
    const clip = new THREE.AnimationClip('WheelLockAction', 2, [wheelTrack, dogTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
