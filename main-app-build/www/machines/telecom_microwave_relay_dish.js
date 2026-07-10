import { materials } from '../utils/materials.js';

export function createMicrowaveRelayDish(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const dishMat = (materials && materials.metal) || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.4 });
    const mountMat = (materials && materials.darkMetal) || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });
    const signalMat = (materials && materials.emissiveBlue) || new THREE.MeshStandardMaterial({ emissive: 0x0000ff, emissiveIntensity: 1, transparent: true, opacity: 0.5 });

    const mountGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const mount = new THREE.Mesh(mountGeo, mountMat);
    group.add(mount);

    const dishGroup = new THREE.Group();
    dishGroup.position.y = 1;
    dishGroup.rotation.x = Math.PI / 4;
    group.add(dishGroup);

    const dishGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = -Math.PI / 2;
    dishGroup.add(dish);

    const feedGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const feed = new THREE.Mesh(feedGeo, mountMat);
    feed.position.z = 0.5;
    feed.rotation.x = Math.PI / 2;
    dishGroup.add(feed);

    const signalGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 32);
    const signal = new THREE.Mesh(signalGeo, signalMat);
    signal.position.z = 1;
    signal.name = 'signalWave';
    dishGroup.add(signal);

    const times = [0, 1, 2];
    const scaleValues = [0.1, 0.1, 0.1, 3, 3, 3, 0.1, 0.1, 0.1];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${signal.name}.scale`, times, scaleValues);
    const opacityValues = [1, 0, 1];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${signal.name}.material.opacity`, times, opacityValues);
    
    const clip = new THREE.AnimationClip('Transmit', 2, [scaleTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
