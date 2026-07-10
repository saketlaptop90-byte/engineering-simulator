import * as materialsModule from '../utils/materials.js';

export function createOpticalParametricOscillator(THREE) {
    const materials = materialsModule.materials || materialsModule;
    const group = new THREE.Group();

    const matTitanium = materials.titanium || new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const matGold = materials.gold || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true });

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, matTitanium);
    base.position.y = -0.25;
    group.add(base);

    // Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.5);
    const crystal = new THREE.Mesh(crystalGeo, matGlass);
    crystal.name = 'NonlinearCrystal';
    crystal.position.set(0, 1, 0);
    group.add(crystal);

    // Mirrors
    const mirrorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const mirror1 = new THREE.Mesh(mirrorGeo, matGold);
    mirror1.rotation.z = Math.PI / 2;
    mirror1.position.set(-1.5, 1, 0);
    group.add(mirror1);

    const mirror2 = mirror1.clone();
    mirror2.position.set(1.5, 1, 0);
    group.add(mirror2);

    // Pump Laser
    const pumpGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const pumpMat = new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.8});
    const pumpLaser = new THREE.Mesh(pumpGeo, pumpMat);
    pumpLaser.name = 'PumpLaser';
    pumpLaser.rotation.z = Math.PI / 2;
    pumpLaser.position.set(-0.75, 1, 0);
    group.add(pumpLaser);

    // Signal & Idler (Entangled Photons)
    const signalGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const signalMat = new THREE.MeshBasicMaterial({color: 0xff0044, transparent: true, opacity: 0.8});
    const signalLaser = new THREE.Mesh(signalGeo, signalMat);
    signalLaser.name = 'SignalLaser';
    signalLaser.rotation.z = Math.PI / 2;
    signalLaser.position.set(0.75, 1, 0.1);
    group.add(signalLaser);

    const idlerGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const idlerMat = new THREE.MeshBasicMaterial({color: 0x44ff00, transparent: true, opacity: 0.8});
    const idlerLaser = new THREE.Mesh(idlerGeo, idlerMat);
    idlerLaser.name = 'IdlerLaser';
    idlerLaser.rotation.z = Math.PI / 2;
    idlerLaser.position.set(0.75, 1, -0.1);
    group.add(idlerLaser);

    // Animation: Crystal pulses, lasers flicker
    const times = [0, 0.5, 1];
    
    const crystalScaleTrack = new THREE.VectorKeyframeTrack(
        'NonlinearCrystal.scale',
        times,
        [1,1,1,  1.2,1.2,1.2,  1,1,1]
    );

    const clip = new THREE.AnimationClip('ParametricDownConversion', 1, [crystalScaleTrack]);
    const animationClips = [clip];

    return { group, animationClips };
}
