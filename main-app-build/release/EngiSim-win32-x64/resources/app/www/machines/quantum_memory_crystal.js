import * as materialsModule from '../utils/materials.js';

export function createQuantumMemoryCrystal(THREE) {
    const materials = materialsModule.materials || materialsModule;
    const group = new THREE.Group();
    
    const matTitanium = materials.titanium || new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true, roughness: 0 });

    // Cryostat Enclosure
    const cryoGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    const cryo = new THREE.Mesh(cryoGeo, matTitanium);
    if(cryo.material) cryo.material = cryo.material.clone();
    cryo.material.transparent = true;
    cryo.material.opacity = 0.3; // Make it semi-transparent to see inside
    group.add(cryo);

    // Memory Crystal Structure (Europium-doped YSO)
    const crystalGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const crystal = new THREE.Mesh(crystalGeo, matGlass);
    crystal.name = 'MemoryCrystal';
    group.add(crystal);

    // Fiber optics coupling
    const fiberGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const fiberMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    
    const fiberTop = new THREE.Mesh(fiberGeo, fiberMat);
    fiberTop.position.y = 2.5;
    group.add(fiberTop);

    const fiberBottom = new THREE.Mesh(fiberGeo, fiberMat);
    fiberBottom.position.y = -2.5;
    group.add(fiberBottom);

    // Data pulses
    const pulseGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const pulse1 = new THREE.Mesh(pulseGeo, pulseMat);
    pulse1.name = 'DataPulse1';
    group.add(pulse1);

    // Animation
    const pulse1Track = new THREE.VectorKeyframeTrack(
        'DataPulse1.position',
        [0, 1, 2, 3],
        [0, 3, 0,  0, 1, 0,  0, -1, 0,  0, -3, 0]
    );

    const crystalScaleTrack = new THREE.VectorKeyframeTrack(
        'MemoryCrystal.scale',
        [0, 1, 2, 3],
        [1,1,1, 1.1,1.1,1.1, 1.1,1.1,1.1, 1,1,1]
    );

    const clip = new THREE.AnimationClip('StoreAndRetrieve', 3, [pulse1Track, crystalScaleTrack]);
    const animationClips = [clip];

    return { group, animationClips };
}
