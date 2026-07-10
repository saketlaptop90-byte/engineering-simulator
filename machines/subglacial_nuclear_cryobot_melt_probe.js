import { materials } from '../utils/materials.js';

export function createNuclearCryobotMeltProbe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body - elongated cylinder
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const body = new THREE.Mesh(bodyGeometry, materials.titanium || new THREE.MeshStandardMaterial({color: 0x888888}));
    group.add(body);

    // Heated Nose Cone
    const noseGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const nose = new THREE.Mesh(noseGeometry, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333, emissive: 0x552200}));
    nose.position.y = -2.5;
    group.add(nose);

    // Tether spool at top
    const spoolGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const spool = new THREE.Mesh(spoolGeometry, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
    spool.position.y = 2.4;
    group.add(spool);

    // Animation: Nose pulsing (heating up), tether unspooling
    const times = [0, 1, 2];
    const noseEmissiveValues = [0, 0, 0, 1, 0.5, 0, 0, 0, 0]; // R G B emissive pulse
    const noseTrack = new THREE.ColorKeyframeTrack(`${nose.uuid}.material.emissive`, times, noseEmissiveValues);

    const spoolRotValues = [0, 0, 0, 1, 0, 1, 0, 0]; // Simplified quaternion
    const spoolTrack = new THREE.QuaternionKeyframeTrack(`${spool.uuid}.quaternion`, times, spoolRotValues);

    const clip = new THREE.AnimationClip('MeltingAndUnspooling', 2, [noseTrack, spoolTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
