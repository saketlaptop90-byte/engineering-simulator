import * as materials from '../utils/materials.js';

export function createLidarCloudCeilometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matBody = materials.whitePaint || new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.8 });
    const matLens = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0x111111, transmission: 0.9, opacity: 1, transparent: true, roughness: 0 });
    const matLaser = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });

    // Main Body
    const bodyGeom = new THREE.BoxGeometry(1.5, 3, 1.5);
    const body = new THREE.Mesh(bodyGeom, matBody);
    body.position.y = 1.5;
    group.add(body);

    // Lens
    const lensGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const lens = new THREE.Mesh(lensGeom, matLens);
    lens.position.y = 3.05;
    group.add(lens);

    // Laser Beam
    const laserGroup = new THREE.Group();
    laserGroup.name = "laserBeam";
    laserGroup.position.y = 3.1;
    group.add(laserGroup);

    const laserGeom = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
    laserGeom.translate(0, 5, 0); // origin at base
    const laser = new THREE.Mesh(laserGeom, matLaser);
    laserGroup.add(laser);

    // Animation (Pulsing Laser via scale)
    const trackScale = new THREE.VectorKeyframeTrack('laserBeam.scale', [0, 0.1, 0.2, 1], [
        1, 0.01, 1,
        1, 1, 1,
        1, 0.01, 1,
        1, 0.01, 1
    ]);
    
    const clip = new THREE.AnimationClip('Pulse', 1, [trackScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
