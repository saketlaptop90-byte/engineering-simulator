import { materials } from '../utils/materials.js';

export function createIceCubeDetector(THREE) {
    const group = new THREE.Group();
    group.name = 'IceCubeString';
    const animationClips = [];

    // Main string cable
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 20, 8);
    const cableMat = materials?.carbonFiber || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    group.add(cable);

    // Photomultiplier tubes (DOMs)
    const numDOMs = 10;
    const tracks = [];
    
    for (let i = 0; i < numDOMs; i++) {
        const domGroup = new THREE.Group();
        domGroup.position.y = -9 + i * (18 / (numDOMs - 1));

        const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const glassMat = materials?.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, transparent: true, opacity: 1, roughness: 0.1, color: 0xaaaaaa });
        const sphere = new THREE.Mesh(sphereGeo, glassMat);
        
        const pmtGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.4, 16);
        const pmtMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
        const pmt = new THREE.Mesh(pmtGeo, pmtMat);
        pmt.position.y = -0.05;

        // Cherenkov flash
        const light = new THREE.PointLight(0x00aaff, 0, 5);
        light.name = `domLight_${i}`;
        
        domGroup.add(light);
        domGroup.add(sphere);
        domGroup.add(pmt);
        group.add(domGroup);

        // Animation track for this DOM
        const delay = (numDOMs - i - 1) * 0.15; // cascade top to bottom
        const times = [0, delay, delay + 0.1, delay + 0.4, 2];
        const values = [0, 0, 10, 0, 0];
        
        const intensityTrack = new THREE.NumberKeyframeTrack(
            `${light.name}.intensity`,
            times,
            values
        );
        tracks.push(intensityTrack);
    }

    const clip = new THREE.AnimationClip('CherenkovCascade', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
