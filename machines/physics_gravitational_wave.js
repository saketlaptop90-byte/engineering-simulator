import { materials } from '../utils/materials.js';

export function createGravitationalWaveInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Beam Splitter
    const centerGeometry = new THREE.BoxGeometry(2, 2, 2);
    const center = new THREE.Mesh(centerGeometry, materials.titanium);
    group.add(center);

    // Interferometer Arms (Vacuum Tubes)
    const armGeometry = new THREE.BoxGeometry(10, 1, 1);
    
    const armX = new THREE.Mesh(armGeometry, materials.darkSteel);
    armX.position.set(6, 0, 0);
    group.add(armX);

    const armZ = new THREE.Mesh(armGeometry, materials.darkSteel);
    armZ.position.set(0, 0, 6);
    armZ.rotation.y = Math.PI / 2;
    group.add(armZ);

    // Test Mass Mirrors
    const mirrorGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    
    const mirrorX = new THREE.Mesh(mirrorGeometry, materials.glass);
    mirrorX.position.set(11.1, 0, 0);
    mirrorX.rotation.z = Math.PI / 2;
    mirrorX.name = 'MirrorX';
    group.add(mirrorX);

    const mirrorZ = new THREE.Mesh(mirrorGeometry, materials.glass);
    mirrorZ.position.set(0, 0, 11.1);
    mirrorZ.rotation.x = Math.PI / 2;
    mirrorZ.name = 'MirrorZ';
    group.add(mirrorZ);

    // Inner Laser Beams
    const laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
    const laserMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.6 
    });
    
    const laserX = new THREE.Mesh(laserGeometry, laserMaterial);
    laserX.position.set(6, 0, 0);
    laserX.rotation.z = Math.PI / 2;
    laserX.name = 'LaserX';
    group.add(laserX);

    const laserZ = new THREE.Mesh(laserGeometry, laserMaterial);
    laserZ.position.set(0, 0, 6);
    laserZ.rotation.x = Math.PI / 2;
    laserZ.name = 'LaserZ';
    group.add(laserZ);

    // Animation: Gravitational wave passing through causing length differential
    const times = [0, 0.5, 1, 1.5, 2];
    
    // Arm X expands, Arm Z contracts, and vice versa
    const xValues = [
        11.1, 0, 0,
        11.4, 0, 0,
        11.1, 0, 0,
        10.8, 0, 0,
        11.1, 0, 0
    ];
    
    const zValues = [
        0, 0, 11.1,
        0, 0, 10.8,
        0, 0, 11.1,
        0, 0, 11.4,
        0, 0, 11.1
    ];
    
    const trackX = new THREE.VectorKeyframeTrack('MirrorX.position', times, xValues);
    const trackZ = new THREE.VectorKeyframeTrack('MirrorZ.position', times, zValues);

    const clip = new THREE.AnimationClip('DetectWave', 2, [trackX, trackZ]);
    animationClips.push(clip);

    return { group, animationClips };
}
