import * as materials from '../utils/materials.js';

export function createVASIMR(THREE) {
    const group = new THREE.Group();
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x8899a6, metalness: 0.9, roughness: 0.2 });
    const matCoil = materials.coil || new THREE.MeshStandardMaterial({ color: 0xc87e4f, metalness: 0.7, roughness: 0.3 });
    const matGlow = materials.glow || new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });

    // Main Confinement Tube (Quartz/Ceramic representation)
    const tubeGeo = new THREE.CylinderGeometry(1, 1, 6, 32);
    const tube = new THREE.Mesh(tubeGeo, matGlass);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Helicon RF Coupler Section (Ionization)
    const rfGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.5, 32);
    const rf = new THREE.Mesh(rfGeo, matMetal);
    rf.position.x = -1.5;
    rf.rotation.z = Math.PI / 2;
    group.add(rf);

    // ICRH Section (Ion Cyclotron Resonance Heating)
    const icrhGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.5, 32);
    const icrh = new THREE.Mesh(icrhGeo, matMetal);
    icrh.position.x = 1.5;
    icrh.rotation.z = Math.PI / 2;
    group.add(icrh);

    // Superconducting Magnetic Coils
    for(let i=0; i<5; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.15, 16, 64), matCoil);
        coil.rotation.y = Math.PI / 2;
        coil.position.x = -2.5 + i * 1.25;
        group.add(coil);
    }

    // Magnetic Nozzle Coils
    for(let i=0; i<3; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.1, 16, 64), matCoil);
        coil.rotation.y = Math.PI / 2;
        coil.position.x = 3.2 + i * 0.4;
        group.add(coil);
    }

    // Plasma Exhaust
    const exhaustGeo = new THREE.CylinderGeometry(0.8, 3, 5, 32, 1, true);
    const exhaust = new THREE.Mesh(exhaustGeo, matGlow);
    exhaust.position.x = 5.5;
    exhaust.rotation.z = -Math.PI / 2;
    group.add(exhaust);
    
    // Core Plasma Stream
    const coreGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const core = new THREE.Mesh(coreGeo, matGlow);
    core.rotation.z = Math.PI / 2;
    group.add(core);

    const animationClips = [];
    
    // Animation for exhaust pulsating and heating
    const scaleTrack = new THREE.VectorKeyframeTrack(
        exhaust.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.1, 1.05, 1.3, 1, 1, 1]
    );
    const coreTrack = new THREE.VectorKeyframeTrack(
        core.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.0, 1.2, 1.0, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('VASIMR_Fire', 1, [scaleTrack, coreTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
