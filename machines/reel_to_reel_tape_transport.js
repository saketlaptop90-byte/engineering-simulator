import { materials } from '../utils/materials.js';

export function createReelToReelTapeTransport(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(8, 6, 1);
    const chassisMesh = new THREE.Mesh(chassisGeo, materials.metallic);
    group.add(chassisMesh);

    // Reels
    const reelGeo = new THREE.CylinderGeometry(2, 2, 0.1, 32);
    reelGeo.rotateX(Math.PI / 2);
    
    const leftReel = new THREE.Mesh(reelGeo, materials.aluminum);
    leftReel.position.set(-2.5, 1, 0.6);
    leftReel.name = "leftReel";
    group.add(leftReel);

    const rightReel = new THREE.Mesh(reelGeo, materials.aluminum);
    rightReel.position.set(2.5, 1, 0.6);
    rightReel.name = "rightReel";
    group.add(rightReel);

    // Head block
    const headGeo = new THREE.BoxGeometry(2, 1, 0.5);
    const headMesh = new THREE.Mesh(headGeo, materials.iron);
    headMesh.position.set(0, -1.5, 0.6);
    group.add(headMesh);

    // Animation: Reels spinning
    const times = [0, 4];
    const rotations = [0, -Math.PI * 4]; // Spin clockwise
    
    const leftTrack = new THREE.NumberKeyframeTrack('leftReel.rotation[z]', times, rotations);
    const rightTrack = new THREE.NumberKeyframeTrack('rightReel.rotation[z]', times, rotations);

    const clip = new THREE.AnimationClip('Playback', 4, [leftTrack, rightTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
