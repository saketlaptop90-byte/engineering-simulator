import { glass, gold, copper, aluminum } from '../utils/materials.js';

export function createDropletGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Chip substrate
    const substrateGeom = new THREE.BoxGeometry(12, 0.2, 8);
    const substrateMat = glass.clone();
    substrateMat.transparent = true;
    substrateMat.opacity = 0.5;
    const substrate = new THREE.Mesh(substrateGeom, substrateMat);
    group.add(substrate);

    // Microchannels
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, transparent: true, opacity: 0.3 });
    const channelGeom1 = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const channel1 = new THREE.Mesh(channelGeom1, channelMat);
    channel1.rotation.z = Math.PI / 2;
    channel1.position.set(-2, 0.1, 0);
    group.add(channel1);

    const channelGeom2 = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const channel2 = new THREE.Mesh(channelGeom2, channelMat);
    channel2.rotation.x = Math.PI / 2;
    channel2.position.set(0, 0.1, -2);
    group.add(channel2);

    const channelGeom3 = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const channel3 = new THREE.Mesh(channelGeom3, channelMat);
    channel3.rotation.x = Math.PI / 2;
    channel3.position.set(0, 0.1, 2);
    group.add(channel3);

    const channelGeom4 = new THREE.CylinderGeometry(0.1, 0.1, 5);
    const channel4 = new THREE.Mesh(channelGeom4, channelMat);
    channel4.rotation.z = Math.PI / 2;
    channel4.position.set(3.5, 0.1, 0);
    group.add(channel4);

    // Droplets
    const dropletsGroup = new THREE.Group();
    dropletsGroup.name = "dropletsGroup";
    group.add(dropletsGroup);

    const dropletGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const dropletMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transmission: 0.9, opacity: 1, ior: 1.33 });

    const tracks = [];
    const duration = 4;
    for (let i = 0; i < 20; i++) {
        const drop = new THREE.Mesh(dropletGeom, dropletMat);
        drop.name = `droplet_${i}`;
        dropletsGroup.add(drop);

        const delay = i * 0.2;
        const times = [0, delay, delay + 1, delay + 2, delay + 3, duration + delay];
        const values = [
            -4, 0.1, 0,
            -4, 0.1, 0,
            0, 0.1, 0,
            3, 0.1, 0,
            5, 0.1, 0,
            5, 0.1, 0
        ];
        
        tracks.push(new THREE.VectorKeyframeTrack(`dropletsGroup/${drop.name}.position`, times, values));
        
        const scaleTimes = [0, delay, delay + 0.1, delay + 2.9, delay + 3, duration + delay];
        const scaleValues = [
            0.01, 0.01, 0.01,
            0.01, 0.01, 0.01,
            1, 1, 1,
            1, 1, 1,
            0.01, 0.01, 0.01,
            0.01, 0.01, 0.01
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`dropletsGroup/${drop.name}.scale`, scaleTimes, scaleValues));
    }

    const clip = new THREE.AnimationClip('GenerateDroplets', duration + 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
