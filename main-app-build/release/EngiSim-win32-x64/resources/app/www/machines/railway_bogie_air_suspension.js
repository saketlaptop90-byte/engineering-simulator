import { materials } from '../utils/materials.js';

export function createBogieAirSuspension(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Bottom Mount
    const mountGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1);
    const mountMat = (materials && materials.metalDark) || new THREE.MeshStandardMaterial({color: 0x333333});
    const bottomMount = new THREE.Mesh(mountGeo, mountMat);
    bottomMount.position.y = -0.3;
    group.add(bottomMount);

    // Air Bag
    const bagGeo = new THREE.SphereGeometry(0.35, 32, 16);
    const bagMat = (materials && materials.rubber) || new THREE.MeshStandardMaterial({color: 0x111111});
    const bag = new THREE.Mesh(bagGeo, bagMat);
    bag.name = 'AirBag';
    bag.scale.y = 0.8;
    group.add(bag);

    // Top Mount
    const topMount = new THREE.Group();
    topMount.name = 'TopMount';
    topMount.position.y = 0.3;
    group.add(topMount);

    const tMountMesh = new THREE.Mesh(mountGeo, mountMat);
    topMount.add(tMountMesh);

    // Animation: Bag compressing and expanding
    const times = [0, 0.5, 1, 1.5, 2];
    
    const topPosValues = [
        0, 0.3, 0,
        0, 0.15, 0,
        0, 0.3, 0,
        0, 0.4, 0,
        0, 0.3, 0
    ];
    const topTrack = new THREE.VectorKeyframeTrack(topMount.uuid + '.position', times, topPosValues);

    const bagScaleValues = [
        1, 0.8, 1,
        1.2, 0.5, 1.2,
        1, 0.8, 1,
        0.9, 1.0, 0.9,
        1, 0.8, 1
    ];
    const bagTrack = new THREE.VectorKeyframeTrack(bag.uuid + '.scale', times, bagScaleValues);

    const clip = new THREE.AnimationClip('CompressSuspension', 2, [topTrack, bagTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
