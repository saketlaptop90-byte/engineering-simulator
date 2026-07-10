import { glass, gold, darkSteel } from '../utils/materials.js';

export function createHawkingRadiationHarvester(THREE) {
    const group = new THREE.Group();
    function generateId() { return Math.random().toString(36).substr(2, 9); }
    
    const blackHoleGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const blackHole = new THREE.Mesh(blackHoleGeometry, darkSteel);
    group.add(blackHole);
    
    const diskGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const disk = new THREE.Mesh(diskGeometry, glass);
    disk.rotation.x = Math.PI / 2;
    disk.name = "accretionDisk_" + generateId();
    group.add(disk);
    
    const siphons = new THREE.Group();
    siphons.name = "siphonsGroup_" + generateId();
    const siphonGeometry = new THREE.CylinderGeometry(0.05, 0.2, 4);
    for (let i = 0; i < 8; i++) {
        const siphon = new THREE.Mesh(siphonGeometry, gold);
        const angle = (i / 8) * Math.PI * 2;
        siphon.position.set(Math.cos(angle) * 2.5, 1, Math.sin(angle) * 2.5);
        siphon.lookAt(0, 0, 0);
        siphons.add(siphon);
    }
    group.add(siphons);

    const animationClips = [];
    const times = [0, 2, 4];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI * 2));
    
    const diskRotTrack = new THREE.QuaternionKeyframeTrack(`${disk.name}.quaternion`, times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    
    const siphonScales = [
        1, 1, 1,
        1, 1.5, 1,
        1, 1, 1
    ];
    const siphonScaleTrack = new THREE.VectorKeyframeTrack(`${siphons.name}.scale`, times, siphonScales);

    const clip = new THREE.AnimationClip('RadiationHarvest', 4, [diskRotTrack, siphonScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
