import * as materials from '../utils/materials.js';

export function createHeliconDoubleLayerThruster(THREE) {
    const group = new THREE.Group();
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const matPlasma = materials.plasma || new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const matAntenna = materials.coil || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

    // Source tube (Dielectric/Glass for RF propagation)
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, matGlass);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Helicon RF Antenna (Nagoya Type III style antenna simplified)
    const antennaGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 16, 64), matAntenna);
        ring.rotation.y = Math.PI / 2;
        ring.rotation.x = Math.PI / 8; // Slanted to represent helical current path
        ring.position.x = -1 + i * 0.6;
        antennaGroup.add(ring);
    }
    group.add(antennaGroup);

    // Solenoids (magnetic field generation for helicon wave propagation)
    const coilGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 64);
    const coil1 = new THREE.Mesh(coilGeo, matMetal);
    coil1.rotation.y = Math.PI / 2;
    coil1.position.x = -1.5;
    group.add(coil1);

    const coil2 = new THREE.Mesh(coilGeo, matMetal);
    coil2.rotation.y = Math.PI / 2;
    coil2.position.x = 1.5;
    group.add(coil2);

    // Expansion Chamber / Magnetic Nozzle (where Double Layer forms)
    const chamberGeo = new THREE.CylinderGeometry(0.8, 2, 2, 32, 1, true);
    const chamber = new THREE.Mesh(chamberGeo, matMetal);
    chamber.position.x = 2.5;
    chamber.rotation.z = -Math.PI / 2;
    group.add(chamber);

    // Core Plasma in the source
    const coreGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 16);
    const core = new THREE.Mesh(coreGeo, matPlasma);
    core.rotation.z = Math.PI / 2;
    group.add(core);

    // Exhaust Plume (Accelerated ions across the double layer)
    const plumeGeo = new THREE.ConeGeometry(2, 6, 32);
    const plume = new THREE.Mesh(plumeGeo, matPlasma);
    plume.position.x = 4.5;
    plume.rotation.z = -Math.PI / 2;
    group.add(plume);

    // Animations representing RF excitation and Double Layer acceleration
    const animationClips = [];
    const plumeTrack = new THREE.VectorKeyframeTrack(
        plume.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1,  1.05, 1, 1.2,  1, 1, 1]
    );
    const coreTrack = new THREE.VectorKeyframeTrack(
        core.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1,  1.1, 1.1, 1,  1, 1, 1]
    );
    
    // Rotating the antenna slightly to simulate dynamic RF waves
    const antennaTrack = new THREE.VectorKeyframeTrack(
        antennaGroup.uuid + '.rotation[x]',
        [0, 1],
        [0, Math.PI * 2]
    );

    const clip = new THREE.AnimationClip('HeliconFire', 2, [plumeTrack, coreTrack, antennaTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
