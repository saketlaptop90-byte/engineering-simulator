import { darkSteel, wood, blackPlastic, brass } from '../utils/materials.js';

export function createCryptographicCylinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central axle (Brass)
    const axleGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 16);
    const axle = new THREE.Mesh(axleGeo, brass);
    axle.rotation.z = Math.PI / 2;
    group.add(axle);

    // End caps (Dark Steel)
    const capGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const cap1 = new THREE.Mesh(capGeo, darkSteel);
    cap1.rotation.z = Math.PI / 2;
    cap1.position.x = -2.4;
    group.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, darkSteel);
    cap2.rotation.z = Math.PI / 2;
    cap2.position.x = 2.4;
    group.add(cap2);

    // Cipher Disks (Wood with brass indicators)
    const tracks = [];
    for (let i = 0; i < 12; i++) {
        const diskGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 32);
        const disk = new THREE.Mesh(diskGeo, wood);
        disk.rotation.z = Math.PI / 2;
        disk.position.x = -2.0 + i * 0.36;
        disk.name = `cryptoDisk${i}`;
        group.add(disk);

        // Indicator to represent a letter or symbol on the edge
        const indicatorGeo = new THREE.BoxGeometry(0.36, 0.1, 0.1);
        const indicator = new THREE.Mesh(indicatorGeo, brass);
        indicator.position.set(0, 0.7, 0);
        disk.add(indicator);

        // Create complex scrambling animation for each disk
        const duration = 4;
        const times = [0, 0.5 + Math.random(), 1.5 + Math.random(), duration];
        // Rotate different amounts
        const rotations = [
            0, 
            Math.PI * (1 + Math.random()), 
            Math.PI * (2 + Math.random()), 
            Math.PI * 4 // End at a nice multiple or scramble completely
        ];
        
        const track = new THREE.NumberKeyframeTrack(`${disk.name}.rotation[x]`, times, rotations);
        tracks.push(track);
    }

    const clip = new THREE.AnimationClip('ScrambleCylinder', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
